import dynamic from "next/dynamic";
import { UI } from "@/components/menu/ui";

const Experience = dynamic(() => import("@/components/menu/Experience"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <UI />
      <Experience />
    </>
  );
}
