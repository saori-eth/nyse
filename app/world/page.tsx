"use client";
import dynamic from "next/dynamic";
const Experience = dynamic(() => import("@/components/game/Experience"), {
  ssr: false,
});
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
