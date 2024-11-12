import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Quiz, Question } from '../types/quiz';

interface Participant {
  username: string;
  score: number;
}

export const useQuizSocket = (isHost: boolean) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{isCorrect: boolean, correctAnswer: string} | null>(null);
  const [quizInfo, setQuizInfo] = useState<{title: string, description: string} | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('error', ({ message }) => {
      setError(message);
    });

    newSocket.on('quizJoined', ({ title, description, currentQuestion, totalQuestions, participants }) => {
      setQuizInfo({ title, description });
      setQuestionNumber(currentQuestion + 1);
      setTotalQuestions(totalQuestions);
      setParticipants(participants);
      setError(null);
    });

    newSocket.on('questionStart', ({ question, questionNumber, totalQuestions }) => {
      setCurrentQuestion(question);
      setQuestionNumber(questionNumber);
      setTotalQuestions(totalQuestions);
      setQuizStarted(true);
      setFeedback(null);
    });

    newSocket.on('participantJoined', ({ participants }) => {
      setParticipants(participants);
    });

    newSocket.on('participantLeft', ({ participants }) => {
      setParticipants(participants);
    });

    newSocket.on('scoreUpdate', ({ participants }) => {
      setParticipants(participants);
    });

    newSocket.on('answerFeedback', (feedback) => {
      setFeedback(feedback);
    });

    newSocket.on('quizEnd', ({ finalScores, quiz }) => {
      setParticipants(finalScores);
      setQuizEnded(true);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const initializeQuiz = (quiz: Quiz) => {
    socket?.emit('initializeQuiz', quiz);
  };

  const joinQuiz = (roomCode: string, username: string) => {
    socket?.emit('joinQuiz', { roomCode, username });
  };

  const startQuiz = (roomCode: string) => {
    socket?.emit('startQuiz', { roomCode });
  };

  const submitAnswer = (roomCode: string, answer: string) => {
    socket?.emit('submitAnswer', { roomCode, answer });
  };

  const nextQuestion = (roomCode: string) => {
    socket?.emit('nextQuestion', { roomCode });
  };

  return {
    initializeQuiz,
    joinQuiz,
    startQuiz,
    submitAnswer,
    nextQuestion,
    participants,
    currentQuestion,
    questionNumber,
    totalQuestions,
    quizStarted,
    quizEnded,
    error,
    feedback,
    quizInfo
  };
};