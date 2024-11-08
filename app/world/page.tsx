"use client";
import dynamic from "next/dynamic";
import { Experience } from "@/components/game/Experience";
import Image from "next/image";
const Chat = dynamic(() => import("@/components/game/ui/Chat"), {
  ssr: false,
});
import { Middleware } from "@/components/Middleware";

export default function Page() {
  return (
    <>
      <Chat />
      <Image
        src="/uzi-reticle.png"
        alt="reticle"
        width={25}
        height={25}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      />
      <Middleware>
        <Experience />
      </Middleware>
    </>
  );
}
