import React from "react";

interface TextAreaInputProps {
  label: string;
  value: string[];
  placeholder?: string;
  rows?: number;
  onChange: (value: string[]) => void;
}

/**
 * Reusable multi-line text input for lists (ports, volumes, networks…)
 */
export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  value,
  placeholder,
  rows = 3,
  onChange,
}) => {
  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = ev.target.value.split("\n").map((x) => x.trim());
    onChange(lines.filter((x) => x));
  };

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        className="border p-1 w-full text-sm rounded mt-1"
        rows={rows}
        value={value.join("\n")}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};
