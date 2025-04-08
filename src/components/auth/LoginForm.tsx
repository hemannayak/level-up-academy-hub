
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        uiToast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        toast.error("Login failed", {
          description: error.message,
        });
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
        console.log("Login successful:", data);
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
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-levelup-purple hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-levelup-gray hover:text-levelup-purple"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
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
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.84 9.49.5.09.68-.22.68-.48v-1.71c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 7.02c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.42.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48C19.14 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"></path>
              </svg>
              GitHub
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8055 10.0415H12V14.0415H17.6515C17.2571 15.1415 16.5467 16.0415 15.6 16.6415C14.6533 17.2415 13.5 17.5415 12 17.5415C9.7459 17.5415 7.8503 16.3415 6.94702 14.5415C6.73171 14.0415 6.56657 13.5415 6.46146 13.0415C6.35635 12.5415 6.30379 12.0415 6.30379 11.5415C6.30379 11.0415 6.35635 10.5415 6.46146 10.0415C6.56657 9.54151 6.73171 9.04151 6.94702 8.54151C7.52576 7.54151 8.37028 6.74151 9.35039 6.24151C10.3305 5.74151 11.1051 5.54151 12 5.54151C13.6343 5.54151 15.0636 6.14151 16.1909 7.24151L19.1145 4.34151C17.3631 2.64151 14.9172 1.54151 12 1.54151C10.2028 1.54151 8.51098 1.94151 6.89407 2.74151C5.27716 3.54151 3.95561 4.64151 2.92944 6.04151C1.90328 7.44151 1.3902 9.04151 1.3902 10.7415C1.3902 12.4415 1.90328 14.0415 2.92944 15.4415C3.95561 16.8415 5.27716 17.9415 6.89407 18.7415C8.51098 19.5415 10.2028 19.9415 12 19.9415C13.7972 19.9415 15.489 19.5415 17.1059 18.7415C18.7228 17.9415 20.0444 16.8415 21.0705 15.4415C22.0967 14.0415 22.6098 12.4415 22.6098 10.7415C22.6098 10.5415 22.6098 10.3415 22.5877 10.1415C22.5659 10.1415 22.2162 10.0415 21.8055 10.0415Z" fill="currentColor"></path>
              </svg>
              Google
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
