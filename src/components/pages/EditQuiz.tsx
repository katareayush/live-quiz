"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Question } from '../../types/quiz';
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebaseConfig';
import { useRouter } from 'next/navigation';

const EditQuizPage: React.FC<{ quizId: string }> = ({ quizId }) => {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);

  // Fetch quiz data on component mount
  React.useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, "quizzes", quizId));
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setQuizTitle(quizData.title);
          setQuizDescription(quizData.description);
          setQuestions(quizData.questions.map((q: any, index: number) => ({
            id: String(index + 1),
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
          })));
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("Failed to load quiz data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      {
        id: String(questions.length + 1),
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]);
  };

  const removeQuestion = (questionId: string): void => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (
    questionId: string, 
    field: keyof Omit<Question, 'id'>, 
    value: string, 
    optionIndex: number | null = null
  ): void => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        if (optionIndex !== null && field === 'options') {
          const newOptions = [...question.options];
          newOptions[optionIndex] = value;
          return { ...question, options: newOptions };
        }
        return { ...question, [field]: value };
      }
      return question;
    }));
  };

  const validateQuiz = () => {
    if (!user) {
      throw new Error('You must be logged in to edit this quiz');
    }

    if (!quizTitle.trim() || !quizDescription.trim()) {
      throw new Error('Quiz title and description are required');
    }

    questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        throw new Error(`Question ${index + 1} text is required`);
      }

      const emptyOptions = question.options.some(opt => !opt.trim());
      if (emptyOptions) {
        throw new Error(`All options for question ${index + 1} must be filled`);
      }

      if (!question.correctAnswer) {
        throw new Error(`Please select a correct answer for question ${index + 1}`);
      }
    });
  };

  const updateQuiz = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to edit this quiz');
      return;
    }

    try {
      setIsSubmitting(true);
      validateQuiz();

      const quizData = {
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        questions: questions.map(({ id, ...rest }) => rest),
        updatedAt: serverTimestamp(),
        metadata: {
          lastModifiedBy: user.uid,
          version: 2,
        }
      };

      // Update in Firestore
      const quizRef = doc(db, "quizzes", quizId);
      await updateDoc(quizRef, quizData);
      
      console.log('Quiz updated successfully');
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Error updating quiz:", error);
        alert("Failed to update quiz. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-pink-600">Loading quiz data...</div>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pink-50 py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-pink-600 mb-8 hover:text-pink-700"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz</h1>
          
          <form onSubmit={updateQuiz} className="space-y-8">
            {/* Quiz Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={quizDescription}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuizDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  placeholder="Enter quiz description"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
              
              {questions.map((question, questionIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border-2 border-pink-100 rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-pink-600 hover:text-pink-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      updateQuestion(question.id, 'questionText', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                    placeholder="Enter question"
                    required
                  />

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-3">
                        <input
                          type="text"
                          value={option}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => 
                            updateQuestion(question.id, 'options', e.target.value, optionIndex)
                          }
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                        <select
                          value={question.correctAnswer === option ? option : ''}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                            updateQuestion(question.id, 'correctAnswer', e.target.value)
                          }
                          className="px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                        >
                          <option value="">Not correct</option>
                          <option value={option}>Correct answer</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-3 border-2 border-dashed border-pink-300 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Question
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-pink-600 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'} <Save className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default EditQuizPage;