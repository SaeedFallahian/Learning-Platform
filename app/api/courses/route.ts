import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/queries';

export async function GET() {
  try {
    const courses = await getCourses();
    console.log('Courses fetched:', courses); // لاگ برای دیباگ
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}