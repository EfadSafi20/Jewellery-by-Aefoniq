import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "px-8 py-3 transition-all duration-300 font-serif tracking-wider text-sm uppercase";
  
  const variants = {
    primary: "bg-gold-600 text-luxury-black hover:bg-gold-400 shadow-[0_0_15px_rgba(251,192,45,0.3)] hover:shadow-[0_0_25px_rgba(251,192,45,0.5)]",
    outline: "border border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-luxury-black",
    ghost: "text-zinc-400 hover:text-gold-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
