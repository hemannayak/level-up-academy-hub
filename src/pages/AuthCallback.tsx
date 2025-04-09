
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          // Successfully authenticated
          toast.success("Successfully signed in!", {
            description: "Welcome to the platform!"
          });
          navigate("/dashboard");
        } else {
          // No session found, redirect to login
          navigate("/login");
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        toast.error("Authentication failed", {
          description: error.message || "Please try again"
        });
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-levelup-purple" />
      <p className="mt-4 text-lg">Finalizing your authentication...</p>
    </div>
  );
};

export default AuthCallback;
