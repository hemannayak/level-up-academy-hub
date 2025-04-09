
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          // If there's no session but we have a hash in the URL, it might be a pending OAuth callback
          // Let's wait a bit to see if the session gets established
          if (location.hash) {
            setTimeout(async () => {
              const { data: { session: delayedSession } } = await supabase.auth.getSession();
              if (delayedSession) {
                toast.success("Successfully signed in!", {
                  description: "Welcome to the platform!"
                });
                navigate("/dashboard");
              } else {
                navigate("/login");
              }
            }, 1000);
          } else {
            // No session and no hash, redirect to login
            navigate("/login");
          }
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
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-levelup-purple" />
      <p className="mt-4 text-lg">Finalizing your authentication...</p>
    </div>
  );
};

export default AuthCallback;
