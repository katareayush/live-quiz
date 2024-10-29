"use client";
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '@/firebaseConfig';
import { Quiz, Question } from '@/types/quiz';
import {
  Plus,
  LogOut,
  Layout,
  User,
  FileQuestion,
  Users,
  BarChart
} from 'lucide-react';

interface DashboardStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const stats: DashboardStat[] = [
    { label: 'Total Quizzes', value: '12', icon: FileQuestion, color: 'bg-pink-100 text-pink-600' },
    { label: 'Total Participants', value: '156', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Completion Rate', value: '78%', icon: BarChart, color: 'bg-blue-100 text-blue-600' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const db = getFirestore(app);
        const quizzesCollection = collection(db, 'quizzes');
        const querySnapshot = await getDocs(quizzesCollection);

        const quizzesData: Quiz[] = await Promise.all(
          querySnapshot.docs.map(async (quizDoc) => {
            const quizData = quizDoc.data();

            // Fetch questions for each quiz
            const questionsCollection = collection(quizDoc.ref, 'questions');
            const questionsSnapshot = await getDocs(questionsCollection);

            const questions: Question[] = questionsSnapshot.docs.map((questionDoc) => ({
              id: questionDoc.id,
              ...questionDoc.data(),
            })) as Question[];

            return {
              id: quizDoc.id,
              title: quizData.title,
              description: quizData.description,
              createdAt: quizData.createdAt.toDate(),
              questions,
            };
          })
        );

        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-xl font-semibold">QuizApp</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/create-quiz"
            className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Quiz
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
          <div className="space-y-4">
            {/* Quiz List */}
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created on {quiz.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {quiz.questions.length} questions
                    </span>
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No quizzes available.</p>
            )}
          </div>

          {/* View All Link */}
          <div className="mt-6 text-center">
            <Link
              href="/quizzes"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              View All Quizzes
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;