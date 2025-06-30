import { NextResponse } from 'next/server';
import { getLessonById } from '@/lib/queries';
import { Lesson } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;
    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // بررسی اینکه lesson.course یک رشته هست یا RecordId
    let lessonCourseId: string;
    if (typeof lesson.course === 'string') {
      lessonCourseId = lesson.course.includes(':')
        ? lesson.course.split(':').pop()!
        : lesson.course;
    } else if (
      typeof lesson.course === 'object' &&
      'tb' in lesson.course &&
      'id' in lesson.course
    ) {
      // پشتیبانی از فرمت RecordId
      lessonCourseId = lesson.course.id;
    } else {
      return NextResponse.json({ error: 'Invalid course reference in lesson' }, { status: 500 });
    }

    console.log('Expected courseId:', courseId, '| Extracted from lesson:', lessonCourseId);

    if (lessonCourseId !== courseId) {
      return NextResponse.json({ error: 'Lesson does not belong to this course' }, { status: 400 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
