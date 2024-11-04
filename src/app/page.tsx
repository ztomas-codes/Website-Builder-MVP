import { Header } from "@/features/header/Header";
import { LandingContent } from "@/features/pageComponents/LandingContent";
import { Problem } from "@/features/pageComponents/Problem";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Produx",
  description: "Get your own custom branded website in minutes",
};

export default function Home() {
  return (
    <>
      <Header actual="/" />
      <LandingContent />
      <Problem />
    </>
  );
}
