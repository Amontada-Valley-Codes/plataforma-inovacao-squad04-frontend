import Image from "next/image";

export default function AuthVisual() {
  return (
    <div className="relative w-full h-screen bg-[#0B005E] overflow-hidden">
      <Image
        src="/images/bg-details.svg"
        alt="bg"
        fill
        className="object-cover"
        priority
      />

    </div>
  );
}
