"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Course } from "@/types/course";

export type CourseDraft = {
  code: string;
  name: string;
  credit: string;
  instructor: string;
};

const emptyDraft: CourseDraft = {
  code: "",
  name: "",
  credit: "",
  instructor: "",
};

type FormErrors = Partial<Record<keyof CourseDraft, string>>;

type CourseFormProps = {
  initialCourse?: Course;
  onSave: (draft: CourseDraft) => void;
  onCancel: () => void;
};

function toDraft(course?: Course): CourseDraft {
  if (!course) {
    return emptyDraft;
  }
  return {
    code: course.code,
    name: course.name,
    credit: String(course.credit),
    instructor: course.instructor,
  };
}

function validate(value: CourseDraft): FormErrors {
  const nextErrors: FormErrors = {};
  if (value.code.trim() === "") {
    nextErrors.code = "กรุณาระบุรหัสวิชา";
  }
  if (value.name.trim() === "") {
    nextErrors.name = "กรุณาระบุชื่อวิชา";
  }
  const credit = Number(value.credit);
  if (!Number.isInteger(credit) || credit < 1 || credit > 6) {
    nextErrors.credit = "หน่วยกิตต้องเป็นจำนวนเต็มตั้งแต่ 1 ถึง 6";
  }
  return nextErrors;
}

export default function CourseForm({
  initialCourse,
  onSave,
  onCancel,
}: CourseFormProps) {
  const [draft, setDraft] = useState<CourseDraft>(toDraft(initialCourse));
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    onSave(draft);
    setDraft(emptyDraft);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginBottom: "20px" }}>
      <div>
        <label htmlFor="code">รหัสวิชา</label><br />
        <input
          id="code"
          name="code"
          type="text"
          value={draft.code}
          onChange={handleChange}
          aria-invalid={!!errors.code}
        />
        {errors.code ? <p style={{ color: "red" }}>{errors.code}</p> : null}
      </div>

      <div>
        <label htmlFor="name">ชื่อวิชา</label><br />
        <input
          id="name"
          name="name"
          type="text"
          value={draft.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
        />
        {errors.name ? <p style={{ color: "red" }}>{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="credit">หน่วยกิต</label><br />
        <input
          id="credit"
          name="credit"
          type="number"
          min="1"
          max="6"
          value={draft.credit}
          onChange={handleChange}
          aria-invalid={!!errors.credit}
        />
        {errors.credit ? <p style={{ color: "red" }}>{errors.credit}</p> : null}
      </div>

      <div>
        <label htmlFor="instructor">ผู้สอน</label><br />
        <input
          id="instructor"
          name="instructor"
          type="text"
          value={draft.instructor}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">บันทึก</button>
        {initialCourse ? (
          <button type="button" onClick={onCancel} style={{ marginLeft: "8px" }}>
            ยกเลิก
          </button>
        ) : null}
      </div>
    </form>
  );
}