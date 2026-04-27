import React from "react";

const Title = ({ title, subTitle, align = "left" }) => {
  // Map prop to Tailwind class
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`text-6xl font-bold ${alignClass} font-playfair`}>{title}</h1>
      <p className={`text-base text-gray-500 ${alignClass} text-wider`}>{subTitle}</p>
    </div>
  );
};

export default Title;