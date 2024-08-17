"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
export const PlayButton = () => {
  const [name] = useLocalStorage("name", "");
  const router = useRouter();
  const play = () => {
    router.push("/world");
  };

  return (
    <button
      className="
        bg-black
        transparent
        opacity-80
        text-white
        text-xl
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
        select-none
      "
      onClick={play}
    >
      Play
    </button>
  );
};
