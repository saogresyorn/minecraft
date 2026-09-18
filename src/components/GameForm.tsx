// src/components/GameForm.tsx
//คอมโพเนนต์ฟอร์มสำหรับ รับข้อมูลเกม ตรวจสอบความถูกต้อง (Validation) และจัดการการบันทึกข้อมูล (เพิ่ม/แก้ไข)
// ประกาศว่าเป็น Client Component เพื่อให้สามารถใช้งาน State และดักจับ Event จากฟอร์มได้
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Game, GameStatus } from "@/types/game";

// กำหนด Type ของข้อมูลระหว่างกรอกในฟอร์ม (ทุกฟิลด์เป็น string เพื่อรองรับการพิมพ์และการเว้นว่าง)
export type GameDraft = {
  name: string;
  platform: string;
  hours: string;
  status: GameStatus;
};

// ค่าตั้งต้นของฟอร์ม (ใช้สำหรับเคลียร์ฟอร์มให้ว่างหลังบันทึกสำเร็จ)
const emptyDraft: GameDraft = {
  name: "",
  platform: "",
  hours: "",
  status: "ยังไม่เริ่ม",
};

// กำหนด Type สำหรับเก็บข้อความแจ้งเตือนข้อผิดพลาด (Error Message) ของแต่ละฟิลด์
type FormErrors = Partial<Record<keyof GameDraft, string>>;

// กำหนด Props ที่คอมโพเนนต์นี้ต้องรับเข้ามา
type GameFormProps = {
  initialGame?: Game;                    // ข้อมูลเกมเดิม (ถ้ามี แสดงว่าเป็นโหมดแก้ไข ถ้าไม่มีคือโหมดเพิ่มใหม่)
  onSave: (draft: GameDraft) => void;    // ฟังก์ชันส่งข้อมูลที่กรอกแล้วกลับไปที่ Parent Component
  onCancel: () => void;                  // ฟังก์ชันยกเลิกการแก้ไข
};

// ฟังก์ชันแปลงข้อมูลจาก Game (ข้อมูลจริง) ให้เป็น GameDraft (ข้อมูลสำหรับฟอร์ม)
function toDraft(game?: Game): GameDraft {
  if (!game) {
    return emptyDraft; // ถ้าไม่มีข้อมูลเดิม ให้ใช้ค่าว่าง
  }
  return {
    name: game.name,
    platform: game.platform,
    hours: String(game.hours), // แปลง number ให้เป็น string เพื่อใส่ใน input type="text/number"
    status: game.status,
  };
}

// ฟังก์ชันตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก (Validation)
function validate(value: GameDraft): FormErrors {
  const nextErrors: FormErrors = {};

  // ตรวจสอบชื่อเกม: ต้องไม่เป็นค่าว่างหลังตัดช่องว่างหัวท้าย
  if (value.name.trim() === "") {
    nextErrors.name = "กรุณาระบุชื่อเกม";
  }

  // ตรวจสอบแพลตฟอร์ม: ต้องไม่เป็นค่าว่าง
  if (value.platform.trim() === "") {
    nextErrors.platform = "กรุณาระบุแพลตฟอร์ม";
  }

  // ตรวจสอบจำนวนชั่วโมง: ต้องเป็นตัวเลขจำนวนเต็มบวกเท่านั้น
  const hours = Number(value.hours);
  if (!Number.isInteger(hours) || hours <= 0) {
    nextErrors.hours = "จำนวนชั่วโมงต้องเป็นจำนวนเต็มบวก";
  }

  return nextErrors; // คืนค่าอ็อบเจกต์เก็บข้อความแจ้งเตือน (ถ้าไม่มี error จะเป็นอ็อบเจกต์ว่าง {})
}

export default function GameForm({ initialGame, onSave, onCancel }: GameFormProps) {
  // State เก็บค่าข้อมูลในฟอร์มปัจจุบัน
  const [draft, setDraft] = useState<GameDraft>(toDraft(initialGame));
  
  // State เก็บข้อความแจ้งเตือนข้อผิดพลาดของแต่ละฟิลด์
  const [errors, setErrors] = useState<FormErrors>({});

  // ฟังก์ชันกลางรองรับการเปลี่ยนแปลงทุกฟิลด์ด้วย Computed Property Name ([name]: value)
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่มส่งฟอร์ม (Submit)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // ยับยั้งพฤติกรรมรีโหลดหน้าเว็บของเบราว์เซอร์

    // ตรวจสอบความถูกต้องของข้อมูล
    const nextErrors = validate(draft);
    setErrors(nextErrors);

    // ถ้ามีข้อผิดพลาด (มีอย่างน้อย 1 ฟิลด์ไม่ผ่าน) ให้หยุดการทำงาน ไม่บันทึก
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // ถ้าผ่านการตรวจสอบ ส่งข้อมูลกลับผ่าน Callback Prop `onSave`
    onSave(draft);

    // ล้างค่าฟอร์มและเคลียร์ Error กลับสู่ค่าเริ่มต้น
    setDraft(emptyDraft);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "12px" }}>
      
      {/* ฟิลด์กรอก: ชื่อเกม */}
      <div>
        <label htmlFor="name">ชื่อเกม</label><br />
        <input 
          id="name" 
          name="name" 
          type="text" 
          value={draft.name} 
          onChange={handleChange} 
          aria-invalid={!!errors.name} // แจ้งโปรแกรมอ่านจอภาพกรณีเกิด Error
        />
        {errors.name ? <p style={{ color: "red" }}>{errors.name}</p> : null}
      </div>

      {/* ฟิลด์กรอก: แพลตฟอร์ม */}
      <div>
        <label htmlFor="platform">แพลตฟอร์ม</label><br />
        <input 
          id="platform" 
          name="platform" 
          type="text" 
          value={draft.platform} 
          onChange={handleChange} 
          aria-invalid={!!errors.platform}
        />
        {errors.platform ? <p style={{ color: "red" }}>{errors.platform}</p> : null}
      </div>

      {/* ฟิลด์กรอก: ชั่วโมงที่เล่น */}
      <div>
        <label htmlFor="hours">ชั่วโมงที่เล่น</label><br />
        <input 
          id="hours" 
          name="hours" 
          type="number" 
          min="1" 
          value={draft.hours} 
          onChange={handleChange} 
          aria-invalid={!!errors.hours}
        />
        {errors.hours ? <p style={{ color: "red" }}>{errors.hours}</p> : null}
      </div>

      {/* ฟิลด์เลือก: สถานะของเกม */}
      <div>
        <label htmlFor="status">สถานะ</label><br />
        <select id="status" name="status" value={draft.status} onChange={handleChange}>
          <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
          <option value="กำลังเล่น">กำลังเล่น</option>
          <option value="เล่นจบแล้ว">เล่นจบแล้ว</option>
        </select>
      </div>

      {/* ส่วนปุ่มกด: บันทึก และ ยกเลิก (ปุ่มยกเลิกจะแสดงเฉพาะตอนอยู่ในโหมดแก้ไขเท่านั้น) */}
      <div style={{ marginTop: "10px" }}>
        <button type="submit">บันทึกเกม</button>
        {initialGame ? (
          <button type="button" onClick={onCancel} style={{ marginLeft: "8px" }}>
            ยกเลิก
          </button>
        ) : null}
      </div>
    </form>
  );
}