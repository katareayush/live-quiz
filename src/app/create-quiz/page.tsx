"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Question } from '../../types/quiz';

const CreateQuizPage: React.FC = () => {
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Here you would implement the Firestore creation logic
    console.log({
      title: quizTitle,
      description: quizDescription,
      questions,
      createdAt: new Date()
    });
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pink-50 py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-pink-600 mb-8 hover:text-pink-700"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Quiz</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
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
                className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 hover:bg-pink-700 transition-colors"
              >
                Save Quiz <Save className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default CreateQuizPage;