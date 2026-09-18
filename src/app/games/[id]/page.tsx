import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { games } from "@/data/games";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { id } = await params;
  const game = games.find((item) => item.id === id);
  return {
    title: game ? game.name : "ไม่พบเกม",
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = games.find((item) => item.id === id);

  if (!game) {
    notFound();
  }

  return (
    <article style={{ padding: "20px" }}>
      <h1>{game.name}</h1>
      <p><strong>แพลตฟอร์ม:</strong> {game.platform}</p>
      <p><strong>ชั่วโมงที่คาดว่าจะใช้เล่น:</strong> {game.hours} ชั่วโมง</p>
      <p><strong>สถานะ:</strong> {game.status}</p>
    </article>
  );
}