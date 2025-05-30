import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label: string;
  name: keyof T;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rows?: number;
}

export default function Input<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  rows,
}: InputProps<T>) {
  const commonClasses =
    "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg text-gray-700";

  return (
    <div>
      <label
        htmlFor={name as string}
        className='block text-lg font-medium text-gray-900'
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          {...register(name as Path<T>)}
          rows={rows}
          placeholder={placeholder}
          className={commonClasses}
        />
      ) : (
        <input
          {...register(name as Path<T>)}
          type={type}
          placeholder={placeholder}
          className={commonClasses}
        />
      )}
      {errors[name] && (
        <p className='mt-1 text-sm text-red-600'>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
