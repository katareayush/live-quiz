export interface Question {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface Quiz {
    title: string;
    description: string;
    createdAt: Date;
    questions: Question[];
    id: string;
  }