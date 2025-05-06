import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ children, className, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <select
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-600 focus:border-primary focus:ring-0 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary ${className || ''}`}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
