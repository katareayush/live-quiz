"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '@/hooks/useAuth';

export interface QuizMetadata {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  userId: string;
}

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<QuizMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user?.uid) {
        setLoading(false);
        setError("Please log in to view your quizzes.");
        return;
      }

      try {
        console.log('Fetching quizzes for user:', user.uid); // Debug log

        const quizzesRef = collection(db, 'quizzes');
        const quizQuery = query(
          quizzesRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(quizQuery);
        
        console.log('Number of quizzes found:', querySnapshot.size); // Debug log

        const quizzesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log('Quiz data:', data); // Debug log for each quiz

          return {
            id: doc.id,
            title: data.title || 'Untitled Quiz',
            description: data.description || 'No description',
            createdAt: data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : new Date(),
            createdBy: data.createdBy || user.uid,
            userId: data.userId || user.uid // Ensure userId is included
          } as QuizMetadata;
        });

        setQuizzes(quizzesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(
          error instanceof Error 
            ? `Error loading quizzes: ${error.message}` 
            : "An unexpected error occurred while loading quizzes."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchQuizzes();
    }
  }, [user?.uid]); // Changed dependency to user?.uid

  // Debug render to check user state
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current quizzes:', quizzes);
  }, [user, quizzes]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-lg">
          Please log in to view your quizzes
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Loading quizzes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Link
          href="/quiz/create"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Create New Quiz
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{quiz.title}</h2>
                  <p className="text-gray-600 mt-1">{quiz.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {quiz.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    View
                  </Link>
                  <Link
                    href={`/quiz/${quiz.id}/edit`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No quizzes found</p>
            <Link
              href="/quiz/create"
              className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Create Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;