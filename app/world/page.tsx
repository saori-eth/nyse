"use client";
import dynamic from "next/dynamic";
const Experience = dynamic(() => import("@/components/game/Experience"), {
  ssr: false,
});
import { Chat } from "@/components/game/ui/Chat";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Middleware } from "@/components/Middleware";

export default function Page() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { progress, active } = useProgress();

  useEffect(() => {
    if (progress === 100 || !active) {
      setLoaded(true);
    }
  }, [progress]);
  return (
    <>
      <Chat />
      <Middleware>
        <Experience />
      </Middleware>
    </>
  );
}
