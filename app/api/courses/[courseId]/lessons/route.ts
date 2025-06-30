import { NextResponse } from 'next/server';
import { getLessonsByCourseId } from '@/lib/queries';
import { Lesson } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const lessons = await getLessonsByCourseId(courseId);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error(`Error fetching lessons for course ${params}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}