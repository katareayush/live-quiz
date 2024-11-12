"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var express = require('express');
var app = express();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
var quizRooms = new Map();
io.on('connection', function (socket) {
    console.log('User connected:', socket.id);
    // Host initializes quiz room
    socket.on('initializeQuiz', function (quiz) {
        var room = {
            quiz: quiz,
            participants: [],
            currentQuestionIndex: -1,
            isActive: true
        };
        quizRooms.set(quiz.roomCode, room);
        socket.join(quiz.roomCode);
        console.log("Quiz room ".concat(quiz.roomCode, " created for quiz: ").concat(quiz.title));
    });
    // Start quiz
    socket.on('startQuiz', function (_a) {
        var roomCode = _a.roomCode;
        var room = quizRooms.get(roomCode);
        if (!room)
            return;
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
    socket.on('joinQuiz', function (_a) {
        var roomCode = _a.roomCode, username = _a.username;
        var room = quizRooms.get(roomCode);
        if (!room) {
            socket.emit('error', { message: 'Quiz room not found' });
            return;
        }
        // Check if username is already taken in this room
        if (room.participants.some(function (p) { return p.username === username; })) {
            socket.emit('error', { message: 'Username already taken' });
            return;
        }
        // Add the new participant to the room
        var newParticipant = {
            socketId: socket.id,
            username: username,
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
            participants: room.participants.map(function (p) { return ({
                username: p.username,
                score: p.score
            }); })
        });
        // Notify other participants that a new user has joined
        io.to(roomCode).emit('participantJoined', {
            participants: room.participants.map(function (p) { return ({
                username: p.username,
                score: p.score
            }); }),
            message: "".concat(username, " joined the quiz")
        });
    });
    // Handle answer submission
    socket.on('submitAnswer', function (_a) {
        var roomCode = _a.roomCode, answer = _a.answer;
        var room = quizRooms.get(roomCode);
        if (!room || room.currentQuestionIndex === -1)
            return;
        var participant = room.participants.find(function (p) { return p.socketId === socket.id; });
        if (!participant)
            return;
        var currentQuestion = room.quiz.questions[room.currentQuestionIndex];
        var isCorrect = answer === currentQuestion.correctAnswer;
        if (isCorrect) {
            participant.score += 10;
        }
        // Send result to the participant who answered
        socket.emit('answerFeedback', {
            isCorrect: isCorrect,
            correctAnswer: currentQuestion.correctAnswer
        });
        // Update all participants with new scores
        io.to(roomCode).emit('scoreUpdate', {
            participants: room.participants.map(function (p) { return ({
                username: p.username,
                score: p.score
            }); })
        });
    });
    // Move to next question
    socket.on('nextQuestion', function (_a) {
        var roomCode = _a.roomCode;
        var room = quizRooms.get(roomCode);
        if (!room)
            return;
        room.currentQuestionIndex++;
        if (room.currentQuestionIndex < room.quiz.questions.length) {
            // Send next question to all participants in the room
            io.to(roomCode).emit('questionStart', {
                question: room.quiz.questions[room.currentQuestionIndex],
                questionNumber: room.currentQuestionIndex + 1,
                totalQuestions: room.quiz.questions.length
            });
        }
        else {
            // End quiz
            var finalScores = room.participants.sort(function (a, b) { return b.score - a.score; });
            io.to(roomCode).emit('quizEnd', {
                finalScores: finalScores,
                quiz: room.quiz
            });
            room.isActive = false;
        }
    });
    socket.on('disconnect', function () {
        quizRooms.forEach(function (room, roomCode) {
            var index = room.participants.findIndex(function (p) { return p.socketId === socket.id; });
            if (index !== -1) {
                var username = room.participants[index].username;
                room.participants.splice(index, 1);
                io.to(roomCode).emit('participantLeft', {
                    participants: room.participants,
                    message: "".concat(username, " has left the quiz")
                });
            }
        });
    });
});
var PORT = process.env.PORT || 3001;
httpServer.listen(PORT, function () {
    console.log("Socket.IO server running on port ".concat(PORT));
});
