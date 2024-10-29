"use client";

import QuizDetailPage from "@/components/pages/quizDetail";


export default function Page({ params }: { params: { id: string } }) {
  return (
    <QuizDetailPage />
  );
}