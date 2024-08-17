"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const options = [
  "#FF0000", // Red
  "#FF8000", // Orange
  "#FFFF00", // Yellow
  "#80FF00", // Lime
  "#00FF00", // Green
  "#00FF80", // Aquamarine
  "#00FFFF", // Cyan
  "#0080FF", // Sky Blue
  "#0000FF", // Blue
  "#8000FF", // Violet
  "#FF00FF", // Magenta
  "#FF0080", // Hot Pink
  "#800000", // Maroon
  "#808000", // Olive
  "#008080", // Teal
  "#800080", // Purple
];

export const ColorPicker = () => {
  const [color, setColor] = useLocalStorage("color", "");
  const [storedColor, setStoredColor] = useState<string | null>(null);
  useEffect(() => {
    if (color) {
      setStoredColor(color);
      console.log("storing color", color);
    }
  }, [color]);
  useEffect(() => {}, [color]);

  return (
    <div className="grid grid-cols-8 gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`w-4 h-4 rounded-full transition-all duration-200 ease-in-out 
                hover:scale-125 hover:opacity-100
                ${
                  storedColor === option
                    ? "scale-125 opacity-100"
                    : "opacity-50"
                }`}
          style={{ backgroundColor: option }}
          onClick={() => setColor(option)}
        />
      ))}
    </div>
  );
};
