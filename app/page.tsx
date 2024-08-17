import dynamic from "next/dynamic";
const UI = dynamic(() => import("@/components/menu/ui"), {
  ssr: false,
});
import { Experience } from "@/components/menu/Experience";

export default function Home() {
  return (
    <>
      <UI />
      <Experience />
    </>
  );
}
