import dynamic from "next/dynamic";
const UI = dynamic(() => import("@/components/menu/ui"), {
  ssr: false,
});
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
