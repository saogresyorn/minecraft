import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses } from "@/data/courses";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = courses.find((item) => item.id === id);
  return {
    title: course ? course.name : "ไม่พบรายวิชา",
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = courses.find((item) => item.id === id);

  if (!course) {
    notFound();
  }

  return (
    <article style={{ padding: "20px" }}>
      <h1>{course.name}</h1>
      <p><strong>รหัสวิชา:</strong> {course.code}</p>
      <p><strong>หน่วยกิต:</strong> {course.credit}</p>
      <p><strong>ผู้สอน:</strong> {course.instructor}</p>
    </article>
  );
}