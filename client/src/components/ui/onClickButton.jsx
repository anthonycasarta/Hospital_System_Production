import React from "react";

const OnClickButton = ({
  children,
  variant = "default",
  className = "",
  onClick,
  type,
}) => {
  return (
    <button
      className={
        variant == "outline"
          ? `bg-white font-medium px-4 py-2 hover:bg-gray-100 rounded-md inline-block border ${className}`
          : `bg-pink-500 text-white font-medium px-4 py-2 hover:bg-pink-600 rounded-md inline-block ${className}`
      }
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default OnClickButton;
