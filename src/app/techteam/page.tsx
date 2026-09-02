import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Team | GDG CRCE",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TechTeamPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center max-w-2xl w-full">
        <Image
          src="/techteam.png"
          alt="gdg 26-26 website makers"
          width={1280}
          height={720}
          priority
          className="w-full h-auto object-contain rounded-lg"
        />
        <p className="mt-4 text-white text-base sm:text-lg text-center">
          gdg 26-26 website makers
        </p>
      </div>
    </main>
  );
}
