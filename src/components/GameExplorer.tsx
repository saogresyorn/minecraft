// src/components/GameExplorer.tsx
// ศูนย์กลางในการเก็บและจัดการสถานะ
// ประกาศว่าเป็น Client Component เพื่อให้สามารถใช้งาน State และจัดการ Event ของผู้ใช้ได้
"use client";
// ทำหน้าที่กรองข้อมูลเกมตามคำค้นหาแบบเรียลไทม์ แล้วส่งต่อข้อมูลไปให้คอมโพเนนต์ลูกแสดงผล
import { useState, type ChangeEvent } from "react";
import type { Game } from "@/types/game";
import GameCard from "@/components/GameCard";
import GameForm, { type GameDraft } from "@/components/GameForm";

// กำหนด Type ของ Props ที่รับข้อมูลชุดเริ่มต้นมาจาก Server Component
type GameExplorerProps = {
  initialGames: Game[];
};

export default function GameExplorer({ initialGames }: GameExplorerProps) {

  // การประกาศ State (ความทรงจำหลักของหน้าจอ)
  const [games, setGames] = useState<Game[]>(initialGames); // เก็บอาร์เรย์รายการเกมทั้งหมดในระบบ
  const [keyword, setKeyword] = useState("");               // เก็บคำค้นหาที่ผู้ใช้พิมพ์ในช่อง input
  const [editingId, setEditingId] = useState<string | null>(null); // เก็บ ID ของเกมที่กำลังแก้ไขอยู่ (ถ้าเป็น null แปลว่ากำลังเพิ่มเกมใหม่)

  // ฟังก์ชันจัดการข้อมูล (CRUD Logic แบบ Immutable Update)


  // ฟังก์ชันสร้างเกมใหม่และเพิ่มต่อท้ายอาร์เรย์เดิม
  function handleCreate(draft: GameDraft) {
    const newGame: Game = {
      id: crypto.randomUUID(),           // สร้างรหัสสุ่มไม่ซ้ำกันในรูปแบบ UUID[cite: 1]
      name: draft.name.trim(),           // ตัดช่องว่างหัวท้ายชื่อเกม
      platform: draft.platform.trim(),   // ตัดช่องว่างแพลตฟอร์ม
      hours: Number(draft.hours),        // แปลงข้อความชั่วโมงเป็นตัวเลข (number)
      status: draft.status,              // กำหนดสถานะเกม
    };
    setGames([...games, newGame]);       // อัปเดต State แบบ Immutable ด้วย Spread Operator[cite: 1]
  }

  // ฟังก์ชันลบเกมออกจากรายการโดยใช้ filter กรองตัวที่ ID ไม่ตรงกับตัวที่จะลบออก
  function handleDelete(id: string) {
  setGames(games.filter((game) => game.id !== id));
}

  // ฟังก์ชันอัปเดตข้อมูลเกมเดิมโดยใช้ map วนหาตัวที่ ID ตรงกันแล้วแก้ไขข้อมูล
  function handleUpdate(id: string, draft: GameDraft) {
    setGames(
      games.map((game) =>
        game.id === id
          ? {
              ...game,
              name: draft.name.trim(),
              platform: draft.platform.trim(),
              hours: Number(draft.hours),
              status: draft.status,
            }
          : game
      )
    );
    setEditingId(null); // ปิดโหมดแก้ไขหลังบันทึกเสร็จ กลับสู่โหมดเพิ่มรายการใหม่
  }

  // ฟังก์ชันกลางสำหรับเลือกว่าจะบันทึกแบบสร้างใหม่ (Create) หรืออัปเดต (Update)
  function handleSave(draft: GameDraft) {
    if (editingId === null) {
      handleCreate(draft);
      return;
    }
    handleUpdate(editingId, draft);
  }

  // Derived State: การคำนวณและกรองข้อมูลแบบสดๆ
  // ค้นหาเกมตัวที่กำลังถูกเลือกแก้ไขอยู่ (เพื่อส่งค่า initialGame ไปให้ฟอร์ม)
  const editingGame = games.find((game) => game.id === editingId);
  
  // แปลงคำค้นหาเป็นตัวพิมพ์เล็กและตัดช่องว่าง
  const searchText = keyword.trim().toLowerCase();
  
  // กรองรายการเกมเฉพาะตัวที่มีชื่อตรงกับคำค้นหา
  const visibleGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchText)
  );

  // ส่วนแสดงผลหน้าจอ (JSX UI)
  return (
    <div>
      {/* ส่วนช่องค้นหาชื่อเกม */}
      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="ค้นหาชื่อเกม..."
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
        />
      </div>

      {/* คอมโพเนนต์ฟอร์ม (ใช้ key เปลี่ยนสถานะเพื่อรีเซ็ตฟอร์มสลับระหว่างโหมดเพิ่มและแก้ไข) */}
      <GameForm
        key={editingId ?? "new"}
        initialGame={editingGame}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />

      <hr style={{ margin: "20px 0" }} />

      {/* เงื่อนไขแสดงรายการเกม หรือแสดงข้อความหากไม่พบข้อมูลตามคำค้น */}
      {visibleGames.length === 0 ? (
        <p>ไม่พบเกมที่ตรงกับคำค้น</p>
      ) : (
        visibleGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onEdit={() => setEditingId(game.id)}           // กดปุ่มแก้ไขเพื่อดึง ID ไปตั้งค่าเปิดโหมดแก้ไข
            onDelete={() => handleDelete(game.id)}       // กดปุ่มลบเพื่อเรียกฟังก์ชันลบข้อมูล
          />
        ))
      )}
    </div>
  );
}