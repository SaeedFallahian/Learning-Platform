'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './CourseDetail.module.css';
import { Course, Lesson } from '@/types';

export default function CourseDetail({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { courseId } = await params;
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (!courseRes.ok) {
          const errorData = await courseRes.json();
          throw new Error(errorData.error || 'Course not found');
        }
        const courseData = await courseRes.json();
        setCourse(courseData);

        const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`);
        if (!lessonsRes.ok) {
          const errorData = await lessonsRes.json();
          throw new Error(errorData.error || 'Failed to fetch lessons');
        }
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      } catch (err: any) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!course) return <div className={styles.container}>Course not found</div>;

  const courseId = typeof course.id === 'string' 
    ? course.id.includes(':') 
      ? course.id.split(':').pop() || course.id // حذف پیشوند course:
      : course.id
    : String(course.id);

  return (
    <div className={styles.container}>
      <div className={styles.courseHeader}>
        <img src={course.icon} alt={`${course.title} icon`} className={styles.courseIcon} />
        <img src={course.image} alt={course.title} className={styles.courseImage} />
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>
      </div>
      <h2 className={styles.subtitle}>Lessons</h2>
      <ul className={styles.lessonList}>
        {lessons.map((lesson) => {
          const lessonId = typeof lesson.id === 'string' 
            ? lesson.id.includes(':') 
              ? lesson.id.split(':').pop() || lesson.id // حذف پیشوند lesson:
              : lesson.id
            : String(lesson.id);

          if (!lessonId) {
            console.error('Invalid lesson ID:', lesson.id);
            return null;
          }

          console.log(`Generated lesson link: /courses/${courseId}/lessons/${lessonId}`);
          return (
            <li key={String(lesson.id)} className={styles.lessonItem}>
              <img src={lesson.thumbnail} alt={lesson.title} className={styles.lessonThumbnail} />
              <div className={styles.lessonContent}>
                <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                <p className={styles.lessonDescription}>{lesson.content}</p>
                <Link href={`/courses/${courseId}/lessons/${lessonId}`} className={styles.lessonLink}>
                  View Lesson
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}