import { HomeEditorial } from "../components/home/HomeEditorial";

export const metadata = {
  title: "PhysicsLab — разобраться в школьной физике",
  description:
    "Темы, типы задач, формулы и честная диагностика ЦТ/ЦЭ — без спешки и стыда за непонимание.",
};

export default function Home() {
  return <HomeEditorial />;
}
