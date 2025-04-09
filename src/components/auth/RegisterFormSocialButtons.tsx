
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RegisterFormSocialButtons = () => {
  const { supabase } = useAuth();
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({
    google: false,
    github: false
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, google: true }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error("Failed to sign in with Google", {
          description: error.message
        });
        console.error("Google sign in error:", error);
      }
    } catch (err: any) {
      console.error("Unexpected error during Google sign in:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(prev => ({ ...prev, github: true }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error("Failed to sign in with GitHub", {
          description: error.message
        });
        console.error("GitHub sign in error:", error);
      }
    } catch (err: any) {
      console.error("Unexpected error during GitHub sign in:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(prev => ({ ...prev, github: false }));
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleGithubSignIn}
        disabled={isLoading.github}
      >
        {isLoading.github ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleGoogleSignIn}
        disabled={isLoading.google}
      >
        {isLoading.google ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8055 10.0415H12V14.0415H17.6515C17.2571 15.1415 16.5467 16.0415 15.6 16.6415C14.6533 17.2415 13.5 17.5415 12 17.5415C9.7459 17.5415 7.8503 16.3415 6.94702 14.5415C6.73171 14.0415 6.56657 13.5415 6.46146 13.0415C6.35635 12.5415 6.30379 12.0415 6.30379 11.5415C6.30379 11.0415 6.35635 10.5415 6.46146 10.0415C6.56657 9.54151 6.73171 9.04151 6.94702 8.54151C7.52576 7.54151 8.37028 6.74151 9.35039 6.24151C10.3305 5.74151 11.1051 5.54151 12 5.54151C13.6343 5.54151 15.0636 6.14151 16.1909 7.24151L19.1145 4.34151C17.3631 2.64151 14.9172 1.54151 12 1.54151C10.2028 1.54151 8.51098 1.94151 6.89407 2.74151C5.27716 3.54151 3.95561 4.64151 2.92944 6.04151C1.90328 7.44151 1.3902 9.04151 1.3902 10.7415C1.3902 12.4415 1.90328 14.0415 2.92944 15.4415C3.95561 16.8415 5.27716 17.9415 6.89407 18.7415C8.51098 19.5415 10.2028 19.9415 12 19.9415C13.7972 19.9415 15.489 19.5415 17.1059 18.7415C18.7228 17.9415 20.0444 16.8415 21.0705 15.4415C22.0967 14.0415 22.6098 12.4415 22.6098 10.7415C22.6098 10.5415 22.6098 10.3415 22.5877 10.1415C22.5659 10.1415 22.2162 10.0415 21.8055 10.0415Z" fill="currentColor"></path>
          </svg>
        )}
        Google
      </Button>
    </div>
  );
};

export default RegisterFormSocialButtons;
