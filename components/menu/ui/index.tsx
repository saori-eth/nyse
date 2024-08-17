"use client";
import { ColorPicker } from "./ColorSelector";
import { NameInput } from "./NameInput";
import { PlayButton } from "./PlayButton";

export const UI = () => {
  return (
    <>
      <Title />
      <div className="absolute inset-0 top-1/4 bottom-0 flex flex-col justify-center items-center z-10 space-y-4">
        <ColorPicker />
        <NameInput />
        <PlayButton />
      </div>
    </>
  );
};

const Title = () => {
  // hello.there website name

  return (
    <div className="absolute h-1/4 w-full flex justify-center items-center z-10 top-24">
      <h1 className="text-6xl text-white font-bold tracking-widest text-shadow-lg z-10 pointer-events-none select-none text-center w-full">
        cutie.cat
      </h1>
    </div>
  );
};
