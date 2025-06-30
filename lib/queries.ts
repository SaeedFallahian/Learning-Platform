import { Course, Lesson } from '@/types';
import db, { connectDB } from './surrealdb';

export async function getCourses(): Promise<Course[]> {
  await connectDB();
  try {
    const result = await db.query<Course[]>(`SELECT * FROM course ORDER BY created_at DESC`);
    let courses: Course[] = [];

    if (Array.isArray(result)) {
      courses = Array.isArray(result[0]) ? result[0] : result;
    } else if (Array.isArray((result[0] as any)?.result)) {
      courses = (result[0] as { result: Course[] }).result;
    }

    console.log('getCourses result:', JSON.stringify(courses, null, 2));
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  await connectDB();
  const courseId = `course:${id}`;
  try {
    const [result] = await db.query<Course[]>(`SELECT * FROM course WHERE id = ${courseId}`);
    const course = Array.isArray(result) && result.length > 0 ? result[0] : null;
    console.log(`Raw course result for ${courseId}:`, JSON.stringify(course, null, 2));
    if (!course) {
      console.error(`Course not found for ID: ${courseId}`);
      return null;
    }
    return course;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    return null;
  }
}

export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  await connectDB();
  try {
    const result = await db.query<Lesson[]>(`SELECT * FROM lesson WHERE course = course:${courseId}`);
    let lessons: Lesson[] = [];

    if (Array.isArray(result)) {
      lessons = Array.isArray(result[0]) ? result[0] : result;
    } else if (Array.isArray((result[0] as any)?.result)) {
      lessons = (result[0] as { result: Lesson[] }).result;
    }

    console.log(`getLessonsByCourseId result for course:${courseId}:`, JSON.stringify(lessons, null, 2));
    return lessons;
  } catch (error) {
    console.error(`Error fetching lessons for course ${courseId}:`, error);
    return [];
  }
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  await connectDB();
  const lessonId = `lesson:${id}`;
  try {
    const [result] = await db.query<Lesson[]>(`SELECT * FROM lesson WHERE id = ${lessonId}`);
    const lesson = Array.isArray(result) && result.length > 0 ? result[0] : null;
    console.log(`Raw lesson result for ${lessonId}:`, JSON.stringify(lesson, null, 2));
    if (!lesson) {
      console.error(`Lesson not found for ID: ${lessonId}`);
      return null;
    }
    return lesson;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    return null;
  }
}