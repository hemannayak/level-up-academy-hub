
import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session, User, SupabaseClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging to check if environment variables are loaded
console.log("Supabase URL:", supabaseUrl || "Not available");
console.log("Supabase Anon Key available:", !!supabaseAnonKey);

// Create a mock client if environment variables are missing
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing! Using mock client.");
  // Create a mock client with dummy methods
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: "Supabase configuration missing" } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase configuration missing" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as unknown as SupabaseClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  supabase: SupabaseClient;
  signUp: (email: string, password: string, metadata?: { full_name: string }) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    supabase,
    signUp: (email: string, password: string, metadata?: { full_name: string }) => {
      return supabase.auth.signUp({
        email, 
        password,
        options: {
          data: metadata,
        }
      });
    },
    signIn: (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
