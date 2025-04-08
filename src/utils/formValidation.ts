
type ValidationErrors = Record<string, string>;

export const validateRegisterForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }
  
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email address is invalid";
  }
  
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  if (!acceptTerms) {
    errors.terms = "You must accept the terms and conditions";
  }
  
  return errors;
};
