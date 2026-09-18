// src/components/GameCard.tsx
// ทำหน้าที่แสดงผลข้อมูลของการ์ดเกมแต่ละใบ ออกแบบมาเพื่อให้ผู้ใช้เห็นข้อมูลสรุปของเกม
import Link from "next/link";
import type { Game } from "@/types/game";

// กำหนด Type ของ Props ที่คอมโพเนนต์นี้ต้องรับเข้ามาใช้งานจาก Parent Component
type GameCardProps = {
  game: Game;               // ข้อมูลรายละเอียดของเกม 1 เกม
  onEdit: () => void;       // ฟังก์ชันสำหรับเรียกเพื่อสั่งแก้ไขเกมนี้
  onDelete: () => void;     // ฟังก์ชันสำหรับเรียกเพื่อสั่งลบเกมนี้
};

export default function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  return (
    // แท็กหลักสำหรับครอบเนื้อหาการแสดงผลการ์ดเกมแต่ละใบ พร้อมจัดสไตล์กรอบและระยะห่าง
    <article style={{ border: "1px solid #ddd", padding: "12px", margin: "8px 0" }}>
      
      {/* ส่วนหัวข้อการ์ด: แสดงชื่อเกม และทำเป็นลิงก์กดคลิกเพื่อเข้าไปดูหน้ารายละเอียดเจาะจง (Dynamic Route) */}
      <h2>
        <Link href={`/games/${game.id}`}>{game.name}</Link>
      </h2>

      {/* ส่วนแสดงข้อมูลรายละเอียดทั่วไปของเกม (แพลตฟอร์ม, จำนวนชั่วโมงที่ใช้เล่น, และสถานะของเกม) */}
      <p>แพลตฟอร์ม: {game.platform} | ชั่วโมง: {game.hours} ชม. | สถานะ: {game.status}</p>

      {/* ปุ่มกดแก้ไข: เมื่อผู้ใช้คลิกจะเรียกฟังก์ชัน onEdit เพื่อส่ง ID กลับไปเปิดโหมดฟอร์มแก้ไข */}
      <button type="button" onClick={onEdit}>แก้ไข</button>

      {/* ปุ่มกดลบ: เมื่อผู้ใช้คลิกจะเรียกฟังก์ชัน onDelete เพื่อสั่งลบเกมออกจากรายการ */}
      <button type="button" onClick={onDelete} style={{ marginLeft: "8px", color: "red" }}>ลบ</button>
      
    </article>
  );
}