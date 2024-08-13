import { useProgress } from "@react-three/drei";

export const LoadingScreen = () => {
  const { progress, errors } = useProgress();

  console.log(progress, errors);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-start items-start bg-black text-white text-2xl z-20">
      <div className="pl-8 pt-8 text-lime-500 font-mono">
        <div className="w-full bg-gray-500" style={{ width: 300 }}>
          <div className="bg-lime-500 h-4" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};
