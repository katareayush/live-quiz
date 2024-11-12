'use client'

import { motion } from 'framer-motion'
import { useEffect, useState , } from 'react'
import Link from 'next/link'
import {useQuizSocket} from '@/hooks/useQuizSocket'
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import { 
  Play, 
  Users, 
  BarChart3, 
  Brain,
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy
} from 'lucide-react'
import WithRouter from '@/utils/WithRouter'


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const socket = io('http://localhost:3001');

interface JoinQuizProps {
  roomCode: string;
}


function JoinQuizForm() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [code, setCode] = useState(roomCode)
  const [username, setUsername] = useState('');

  const handleJoinQuiz = () => {
    socket.emit('joinQuiz', { roomCode, username });

    socket.on('quizJoined', (quizData) => {
      // Navigate to the specific quiz room page
      navigate(`/quiz/${roomCode}`, { state: quizData });
    });

    socket.on('error', (error) => {
      // Handle error, e.g., display an error message
      console.error(error.message);
    });
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      className="relative bg-pink-50 py-20 px-4 overflow-hidden"
    >
      <motion.div 
        variants={fadeIn}
        className="container mx-auto text-center"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-pink-800"
        >
          Engage Your Audience in Real-Time
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
        >
          Create interactive quizzes, polls, and surveys that make learning fun and engagement measurable
        </motion.p>

        <motion.div 
          variants={staggerContainer}
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12"
        >
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-6 py-3 rounded-full text-lg border-2 border-pink-300 focus:border-pink-500 outline-none w-full md:w-64"
          />
          <input
            type="text"
            placeholder="Enter session code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-6 py-3 rounded-full text-lg border-2 border-pink-300 focus:border-pink-500 outline-none w-full md:w-64"
          />
          <button 
            onClick={handleJoinQuiz}
            className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 hover:bg-pink-700 transition-colors"
          >
            Join Session <Play className="w-5 h-5" />
          </button>
          <Link href="/create" className="bg-pink-400 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 hover:bg-pink-500 transition-colors">
            Create Quiz <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[{ number: '1M+', label: 'Active Users', icon: Users }, { number: '500K+', label: 'Quizzes Created', icon: Brain }, { number: '10M+', label: 'Questions Answered', icon: CheckCircle }, { number: '98%', label: 'Satisfaction Rate', icon: Trophy }].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <stat.icon className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stat.number}</h3>
              <p className="text-gray-700">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

const FeaturesSection = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-20 px-4 bg-white"
    >
      <div className="container mx-auto">
        <motion.h2 
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Everything You Need for Interactive Learning
        </motion.h2>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: 'Real-time Interaction',
              description: 'Engage your audience with live polls, quizzes, and instant feedback',
              icon: Zap,
              color: 'bg-pink-100 text-pink-600'
            },
            {
              title: 'Detailed Analytics',
              description: 'Track participation and performance with comprehensive insights',
              icon: BarChart3,
              color: 'bg-pink-100 text-pink-600'
            },
            {
              title: 'Multiple Question Types',
              description: 'Choose from various formats including MCQ, polls, word clouds, and more',
              icon: Brain,
              color: 'bg-pink-100 text-pink-600'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

const DemoSection = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-20 px-4 bg-pink-50"
    >
      <div className="container mx-auto">
        <motion.div 
          variants={fadeIn}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">See it in Action</h2>
            <p className="text-gray-700 mb-8">Watch how easy it is to create and manage interactive quizzes</p>
            
            <motion.div 
              variants={fadeIn}
              className="aspect-video bg-gray-200 rounded-lg"
            >
              {/* Add your video player component here */}
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

const CTASection = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-20 px-4 bg-[#bd8ca0] text-white"
    >
      <motion.div 
        variants={fadeIn}
        className="container mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Presentations?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of educators and presenters making learning interactive</p>
        <Link 
          href="/signup"
          className="bg-white text-pink-600 px-8 py-3 rounded-full text-lg inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </motion.section>
  )
}

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <WithRouter>
        <JoinQuizForm/>
      </WithRouter>
      <FeaturesSection />
      <DemoSection />
      <CTASection />
      
    </main>
  )
}
