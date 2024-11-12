import { Server } from 'socket.io';
import { createServer } from 'http';
const express = require('express');

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  title: string;
  description: string;
  createdAt: Date;
  questions: Question[];
  id: string;
  roomCode: string;
}

interface QuizRoom {
  quiz: Quiz;
  participants: {
    socketId: string;
    username: string;
    score: number;
  }[];
  currentQuestionIndex: number;
  isActive: boolean;
  startTime?: number;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const quizRooms = new Map<string, QuizRoom>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Host initializes quiz room
  socket.on('initializeQuiz', (quiz: Quiz) => {
    const room: QuizRoom = {
      quiz,
      participants: [],
      currentQuestionIndex: -1,
      isActive: true
    };
    quizRooms.set(quiz.roomCode, room);
    socket.join(quiz.roomCode);
    
    console.log(`Quiz room ${quiz.roomCode} created for quiz: ${quiz.title}`);
  });

  // Start quiz
  socket.on('startQuiz', ({ roomCode }) => {
    const room = quizRooms.get(roomCode);
    if (!room) return;

    room.currentQuestionIndex = 0;
    room.startTime = Date.now();

    // Send first question to all participants
    io.to(roomCode).emit('questionStart', {
      question: room.quiz.questions[0],
      questionNumber: 1,
      totalQuestions: room.quiz.questions.length
    });
  });

  // Participant joins quiz
  socket.on('joinQuiz', ({ roomCode, username }) => {
    const room = quizRooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: 'Quiz room not found' });
      return;
    }

    // Check if username is already taken in this room
    if (room.participants.some(p => p.username === username)) {
      socket.emit('error', { message: 'Username already taken' });
      return;
    }

    // Add the new participant to the room
    const newParticipant = {
      socketId: socket.id,
      username,
      score: 0
    };
    room.participants.push(newParticipant);

    socket.join(roomCode);

    // Send quiz info and current state to the new participant
    socket.emit('quizJoined', {
      title: room.quiz.title,
      description: room.quiz.description,
      currentQuestion: room.currentQuestionIndex,
      totalQuestions: room.quiz.questions.length,
      participants: room.participants.map(p => ({
        username: p.username,
        score: p.score
      }))
    });

    // Notify other participants that a new user has joined
    io.to(roomCode).emit('participantJoined', {
      participants: room.participants.map(p => ({
        username: p.username,
        score: p.score
      })),
      message: `${username} joined the quiz`
    });
  });

  // Handle answer submission
  socket.on('submitAnswer', ({ roomCode, answer }) => {
    const room = quizRooms.get(roomCode);
    if (!room || room.currentQuestionIndex === -1) return;

    const participant = room.participants.find(p => p.socketId === socket.id);
    if (!participant) return;

    const currentQuestion = room.quiz.questions[room.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      participant.score += 10;
    }

    // Send result to the participant who answered
    socket.emit('answerFeedback', {
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Update all participants with new scores
    io.to(roomCode).emit('scoreUpdate', {
      participants: room.participants.map(p => ({
        username: p.username,
        score: p.score
      }))
    });
  });

  // Move to next question
  socket.on('nextQuestion', ({ roomCode }) => {
    const room = quizRooms.get(roomCode);
    if (!room) return;

    room.currentQuestionIndex++;

    if (room.currentQuestionIndex < room.quiz.questions.length) {
      // Send next question to all participants in the room
      io.to(roomCode).emit('questionStart', {
        question: room.quiz.questions[room.currentQuestionIndex],
        questionNumber: room.currentQuestionIndex + 1,
        totalQuestions: room.quiz.questions.length
      });
    } else {
      // End quiz
      const finalScores = room.participants.sort((a, b) => b.score - a.score);
      io.to(roomCode).emit('quizEnd', {
        finalScores,
        quiz: room.quiz
      });
      room.isActive = false;
    }
  });

  socket.on('disconnect', () => {
    quizRooms.forEach((room, roomCode) => {
      const index = room.participants.findIndex(p => p.socketId === socket.id);
      if (index !== -1) {
        const username = room.participants[index].username;
        room.participants.splice(index, 1);
        io.to(roomCode).emit('participantLeft', {
          participants: room.participants,
          message: `${username} has left the quiz`
        });
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});