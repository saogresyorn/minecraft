import type { Course } from "@/types/course";

export type CoursesAction =
  | { type: "created"; course: Course }
  | { type: "deleted"; id: string }
  | { type: "updated"; id: string; course: Course };

export function coursesReducer(
  state: Course[],
  action: CoursesAction
): Course[] {
  switch (action.type) {
    case "created":
      return [...state, action.course];
    case "deleted":
      return state.filter((course) => course.id !== action.id);
    case "updated":
      return state.map((course) =>
        course.id === action.id ? action.course : course
      );
    default:
      return state;
  }
}