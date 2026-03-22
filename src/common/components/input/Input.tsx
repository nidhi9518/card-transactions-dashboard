import { useId } from "react";

type InputProps<T extends string | number> = {
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange?: (value: string) => void;
  value?: T;
};
export default function Input<T extends string | number>({
  label,
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps<T>) {
  const id = useId();
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(event.target.value);
  }
  return (
    <>
      <label htmlFor={id}>
        <strong>
          {label}
          {required && <span aria-label="required">*</span>}
        </strong>
      </label>
      <input
        id={id}
        className="p-10"
        type={type}
        value={value ?? ""}
        required={required}
        aria-required={required}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
}
