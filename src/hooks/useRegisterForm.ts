
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { validateRegisterForm } from "@/utils/formValidation";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  acceptTerms: boolean;
  isLoading: boolean;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAcceptTerms: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { signUp } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when field changes
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const validate = () => {
    const newErrors = validateRegisterForm(
      formData.fullName,
      formData.email,
      formData.password,
      formData.confirmPassword,
      acceptTerms
    );
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsLoading(true);
      
      try {
        const { error, data } = await signUp(
          formData.email,
          formData.password,
          { full_name: formData.fullName }
        );
        
        if (error) {
          uiToast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
          toast.error("Registration failed", {
            description: error.message,
          });
          console.error("Registration error:", error);
        } else {
          uiToast({
            title: "Registration successful!",
            description: "Please check your email to confirm your account.",
            variant: "default",
          });
          toast.success("Registration successful!", {
            description: "Please check your email to confirm your account.",
          });
          console.log("Registration successful:", data);
          navigate("/login");
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

  return {
    formData,
    acceptTerms,
    isLoading,
    errors,
    handleChange,
    setAcceptTerms,
    handleSubmit,
  };
};
