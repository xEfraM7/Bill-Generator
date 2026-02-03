import { FormFieldProps } from "@/types/FormTypes";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";
import { DocumentInput } from "./DocumentInput";

export const FormField = ({
  type,
  placeholder,
  name,
  error,
  label,
  control,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "document-id" ? (
            <DocumentInput
              id={name}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              className={` ${error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
                }`}
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className={`h-12 text-base ${error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
                }`}
            />
          )
        }
      />
      {error && (
        <span className="text-red-500 text-sm flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error.message}
        </span>
      )}
    </div>
  );
};
