import Image from "next/image";

export default function AuthVisual() {
  return (
    <div className="relative bg-[#0B005E]">
      <Image src={"/images/bg-details.svg"} alt="bg" fill className="object-cover" />
      <div className="relative flex justify-center items-center w-full h-full">
        <Image src={"/images/ninna-image.svg"} alt="ninna" width={587} height={577} />
      </div>
    </div>
  );
}
