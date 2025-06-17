export default function Line() {
  const text = "MAXISM";

  return (
    <div className="relative h-screen flex justify-center items-center">
      <div
        className="absolute top-0 w-[1px] bg-zinc-600"
        style={{ height: "calc(50% - 48px)" }}
      ></div>

      <div className="z-10 flex flex-col items-center">
        {text
          .split("")
          .reverse() 
          .map((char, index) => (
            <span
              key={index}
              className="text-white text-sm rotate-[270deg] leading-none"
            >
              {char}
            </span>
          ))}
      </div>

      <div
        className="absolute bottom-0 w-[1px] bg-zinc-600"
        style={{ height: "calc(50% - 48px)" }}
      ></div>
    </div>
  );
}
