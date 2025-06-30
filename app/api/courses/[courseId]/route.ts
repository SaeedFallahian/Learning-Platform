import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/queries';
import { Course } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error(`Error fetching course ${params}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}