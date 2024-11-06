import { collection, query, where, getDocs } from "firebase/firestore";

// Function to generate a unique 8-digit random room code
export const generateRoomCode = async (db: any): Promise<string> => {
  const generateCode = (): string => {
    const min = 10000000; // Minimum 8-digit number
    const max = 99999999; // Maximum 8-digit number
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  let roomCode = generateCode();
  let isUnique = false;

  // Check if the generated room code already exists in the database
  while (!isUnique) {
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("roomCode", "==", roomCode));
    const querySnapshot = await getDocs(q);

    // If no existing rooms with the same code are found, it's unique
    if (querySnapshot.empty) {
      isUnique = true;
    } else {
      // If a room code already exists, generate a new one
      roomCode = generateCode();
    }
  }

  return roomCode;
};
