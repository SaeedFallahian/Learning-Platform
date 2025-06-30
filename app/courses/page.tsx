'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import styles from './Courses.module.css';
import { Course } from '@/types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          setError('Please sign in to view courses');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className={styles.container}>
      <SignedIn>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className={styles.empty}>No courses available.</div>
        )}
        {!loading && !error && courses.length > 0 && (
          <div className={styles.grid}>
            {courses.map((course) => {
              const courseId = typeof course.id === 'string' 
                ? course.id.includes(':') ? course.id.split(':')[1] : course.id
                : String(course.id);
              return (
                <Link
                  href={`/courses/${courseId}`}
                  key={String(course.id)}
                  className={styles.card}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className={styles.courseImage}
                  />
                  <div className={styles.cardContent}>
                    <h2 className={styles.title}>{course.title}</h2>
                    <p className={styles.description}>{course.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className={styles.signInPrompt}>
          <h2>Please sign in to view courses</h2>
          <SignInButton mode="modal">
            <button className={styles.signInButton}>Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}