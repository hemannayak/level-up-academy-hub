
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { LogIn, Github, Mail, AlertCircle } from "lucide-react";
import PasswordInput from "@/components/ui/PasswordInput";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const { signIn } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when field changes
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
    // Clear the email not confirmed error when email changes
    if (e.target.id === "email" && emailNotConfirmed) {
      setEmailNotConfirmed(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsLoading(true);
      setEmailNotConfirmed(false);
      
      try {
        const { error } = await signIn(
          formData.email,
          formData.password
        );
        
        if (error) {
          // Check specifically for the email not confirmed error
          if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
            setEmailNotConfirmed(true);
            uiToast({
              title: "Email verification required",
              description: "Please check your inbox and verify your email before logging in.",
              variant: "default",
            });
          } else {
            uiToast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
            toast.error("Login failed", {
              description: error.message,
            });
          }
          console.error("Login error:", error);
        } else {
          uiToast({
            title: "Login successful!",
            description: "Welcome back!",
            variant: "default",
          });
          toast.success("Login successful!", {
            description: "Welcome back!",
          });
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        uiToast({
          title: "An unexpected error occurred",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        toast.error("An unexpected error occurred", {
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error("GitHub login failed", {
          description: error.message,
        });
        console.error("GitHub login error:", error);
      }
    } catch (error: any) {
      console.error("Unexpected error during GitHub login:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error("Google login failed", {
          description: error.message,
        });
        console.error("Google login error:", error);
      }
    } catch (error: any) {
      console.error("Unexpected error during Google login:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailNotConfirmed && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your email address has not been verified yet. Please check your inbox and follow the verification link before logging in.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/reset-password" className="text-sm text-levelup-purple hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={handleChange}
              hasError={!!errors.password}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-levelup-purple hover:bg-levelup-purple/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" /> Sign in
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-levelup-gray">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full"
            >
              {isGoogleLoading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGithubLogin}
              disabled={isGithubLoading}
              className="w-full"
            >
              {isGithubLoading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-levelup-gray">
          Don't have an account?{" "}
          <Link to="/register" className="text-levelup-purple hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
