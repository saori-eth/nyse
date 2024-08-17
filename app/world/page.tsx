"use client";
import dynamic from "next/dynamic";
import { Experience } from "@/components/game/Experience";
const Chat = dynamic(() => import("@/components/game/ui/Chat"), {
  ssr: false,
});
import { Middleware } from "@/components/Middleware";

export default function Page() {
  return (
    <>
      <Chat />
      <Middleware>
        <Experience />
      </Middleware>
    </>
  );
}
