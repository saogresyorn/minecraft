"use client";

import { useState, type ChangeEvent } from "react";
import type { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import CourseForm, { type CourseDraft } from "@/components/CourseForm";

type CourseExplorerProps = {
  initialCourses: Course[];
};

export default function CourseExplorer({ initialCourses }: CourseExplorerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleCreate(draft: CourseDraft) {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      code: draft.code.trim(),
      name: draft.name.trim(),
      credit: Number(draft.credit),
      instructor: draft.instructor.trim(),
    };
    setCourses([...courses, newCourse]);
  }

  function handleDelete(id: string) {
    setCourses(courses.filter((course) => course.id !== id));
  }

  function handleUpdate(id: string, draft: CourseDraft) {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              code: draft.code.trim(),
              name: draft.name.trim(),
              credit: Number(draft.credit),
              instructor: draft.instructor.trim(),
            }
          : course
      )
    );
    setEditingId(null);
  }

  function handleSave(draft: CourseDraft) {
    if (editingId === null) {
      handleCreate(draft);
      return;
    }
    handleUpdate(editingId, draft);
  }

  const editingCourse = courses.find((course) => course.id === editingId);
  const searchText = keyword.trim().toLowerCase();
  const visibleCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchText) ||
      course.code.toLowerCase().includes(searchText)
  );

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <input
          id="keyword"
          placeholder="ค้นหารายวิชา..."
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
        />
      </div>

      <CourseForm
        key={editingId ?? "new"}
        initialCourse={editingCourse}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />

      <hr style={{ margin: "20px 0" }} />

      {visibleCourses.length === 0 ? (
        <p>ไม่พบรายวิชาที่ตรงกับคำค้น</p>
      ) : (
        visibleCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => setEditingId(course.id)}
            onDelete={() => handleDelete(course.id)}
          />
        ))
      )}
    </div>
  );
}