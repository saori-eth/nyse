"use client";
import dynamic from "next/dynamic";
const Experience = dynamic(() => import("../components/game/Experience"), {
  ssr: false,
});
import { Header } from "@/components/ui/Header";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useProgress } from "@react-three/drei";
import { Middleware } from "@/components/Middleware";

export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { progress, active } = useProgress();

  useEffect(() => {
    if (progress === 100 || !active) {
      setLoaded(true);
    }
  }, [progress]);
  return (
    <>
      {/* {!loaded && <LoadingScreen />}
      {loaded && <Header />} */}
      <Middleware>
        <Experience />
      </Middleware>
    </>
  );
}
