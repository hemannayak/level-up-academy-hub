
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  required?: boolean;
}

const PasswordInput = ({
  id,
  placeholder = "••••••••",
  value,
  onChange,
  hasError = false,
  required = false,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`pr-10 ${hasError ? "border-red-500" : ""}`}
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
  );
};

export default PasswordInput;
