// "use client"
// import { useState } from "react";
// import { db } from "@/firebaseConfig"; 
// import { collection, addDoc, doc, setDoc } from "firebase/firestore";
// import { useAuth } from "../../hooks/useAuth"; // Assuming you have AuthContext

// const CreateQuiz = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
//   const { currentUser } = useAuth();

//   const handleAddQuestion = () => {
//     setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
//   };

//   const handleQuestionChange = (index, key, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][key] = value;
//     setQuestions(newQuestions);
//   };

//   const handleOptionChange = (questionIndex, optionIndex, value) => {
//     const newQuestions = [...questions];
//     newQuestions[questionIndex].options[optionIndex] = value;
//     setQuestions(newQuestions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || questions.length === 0) {
//       alert("Please provide a title and at least one question.");
//       return;
//     }
    
//     const quizRef = await addDoc(collection(db, "quizzes"), {
//       title,
//       description,
//       authorId: currentUser.uid,
//       createdAt: new Date(),
//     });

//     const quizId = quizRef.id;

//     for (let question of questions) {
//       const questionRef = doc(db, `quizzes/${quizId}/questions`, question.questionText);
//       await setDoc(questionRef, question);
//     }

//     // Redirect to quizzes dashboard or display success message
//     alert("Quiz created successfully!");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Create a New Quiz</h2>
//       <input
//         type="text"
//         placeholder="Quiz Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       {questions.map((question, index) => (
//         <div key={index}>
//           <input
//             type="text"
//             placeholder={`Question ${index + 1}`}
//             value={question.questionText}
//             onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
//           />
//           {question.options.map((option, optionIndex) => (
//             <input
//               key={optionIndex}
//               type="text"
//               placeholder={`Option ${optionIndex + 1}`}
//               value={option}
//               onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
//             />
//           ))}
//           <input
//             type="text"
//             placeholder="Correct Answer"
//             value={question.correctAnswer}
//             onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
//           />
//         </div>
//       ))}

//       <button type="button" onClick={handleAddQuestion}>Add Question</button>
//       <button type="submit">Create Quiz</button>
//     </form>
//   );
// };

// export default CreateQuiz;
