"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '@/firebaseConfig';
import { Quiz, Question } from '@/types/quiz';
import { ArrowLeft, Clock, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [key: string]: string };
  showResults: boolean;
}

export default function QuizDetailPage() {
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log('Fetching quiz with ID:', params.id);
        
        if (!params.id) {
          setError('Quiz ID is missing');
          console.error('Quiz ID is missing from params');
          return;
        }

        const db = getFirestore(app);
        const quizDoc = doc(db, 'quizzes', params.id as string);
        console.log('Firestore document path:', quizDoc.path);
        
        const quizSnapshot = await getDoc(quizDoc);

        setDebugInfo({
          exists: quizSnapshot.exists(),
          id: quizSnapshot.id,
          path: quizDoc.path,
          timestamp: new Date().toISOString()
        });

        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.data();
          console.log('Quiz data retrieved:', quizData);
          
          if (!quizData.title || !quizData.questions) {
            setError('Invalid quiz data structure');
            console.error('Invalid quiz data:', quizData);
            return;
          }

          setQuiz({
            id: quizSnapshot.id,
            title: quizData.title,
            description: quizData.description || '',
            createdAt: quizData.createdAt?.toDate() || new Date(),
            questions: quizData.questions || [],
            roomCode: quizData.roomCode || 'NA'
          });
        } else {
          console.error('Quiz document does not exist');
          setError('Quiz not found');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err instanceof Error ? err.message : 'Error loading quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questionId]: answer
      }
    }));
  };

  const handleNext = () => {
    if (quiz && quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleSubmit = () => {
    setQuizState(prev => ({
      ...prev,
      showResults: true
    }));
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach(question => {
      if (quizState.selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Quiz</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {error || 'Quiz not found'}
                </AlertDescription>
              </Alert>
              
              {debugInfo && process.env.NODE_ENV === 'development' && (
                <div className="text-left bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-bold mb-2">Debug Information:</h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              <Link href="/dashboard">
                <Button className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>{quiz.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-pink-600 mb-2">
                    {calculateScore()}%
                  </div>
                  <p className="text-gray-600">Final Score</p>
                </div>
                
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">
                        Question {index + 1}: {question.questionText}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {' '}
                        <span 
                          className={quizState.selectedAnswers[question.id] === question.correctAnswer 
                            ? 'text-green-600 font-medium' 
                            : 'text-red-600 font-medium'
                          }
                        >
                          {quizState.selectedAnswers[question.id]}
                        </span>
                      </p>
                      {quizState.selectedAnswers[question.id] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <Link href="/dashboard">
                    <Button>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{quiz.title}</CardTitle>
              <Badge variant="outline" className="text-pink-600">
                Question {quizState.currentQuestionIndex + 1} of {quiz.questions.length}
              </Badge>
            </div>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{currentQuestion.questionText}</h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full p-4 text-left rounded-lg border transition-colors ${
                        quizState.selectedAnswers[currentQuestion.id] === option
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handlePrevious}
                  disabled={quizState.currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {quizState.currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(quizState.selectedAnswers).length !== quiz.questions.length}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!quizState.selectedAnswers[currentQuestion.id]}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}