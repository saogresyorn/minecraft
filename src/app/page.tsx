// src/app/page.tsx
import GameExplorer from "@/components/GameExplorer";
import { games } from "@/data/games";

export default function Home() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>ระบบจัดการรายการเกม</h1>
      <p>ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูลเกมของคุณ</p>
      <hr style={{ margin: "20px 0" }} />
      <GameExplorer initialGames={games} />
    </main>
  );
}