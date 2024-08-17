"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const NameInput = () => {
  const [name, setName] = useLocalStorage("name", "");
  return (
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter name"
      className="
        bg-black
        transparent
        opacity-80
        text-white
        text-2xl
        p-2
        border-2
        border-white
        hover:bg-gray-800
        hover:opacity-100
        transition
        duration-500
        ease-in-out
        transform
        hover:scale-110
        focus:outline-none
        focus:ring-2
        focus:ring-white
        focus:ring-opacity-50
        placeholder-gray-400
        text-center
      "
    />
  );
};
