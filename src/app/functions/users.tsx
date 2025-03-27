import { Session } from "../dashboard/page";

export const calculateProgressFromSessions = (sessions: Session[]): number => {
    if (!sessions || sessions.length === 0) {
      return 0; // If there are no sessions, return 0 progress
    }
  
    // Get the current date and time
    const now = new Date();
  
    // Count the number of completed sessions (those that are before the current date)
    const completedSessions = sessions.filter((session) => new Date(session.date) < now).length;
  
    // Total number of sessions in the program
    const totalSessions = sessions.length;
  
    // Calculate the progress as a percentage
    const progress = (completedSessions / totalSessions) * 100;
  
    return progress;
  }
  
  // Example usage:
//   const program = {
//     name: "Knee Rehabilitation",
//     sessions: [
//       { id: "session_knee_01", date: "2024-03-12T09:00:00Z", exercises: [] },
//       { id: "session_knee_02", date: "2024-03-14T09:00:00Z", exercises: [] },
//       { id: "session_knee_03", date: "2024-03-18T09:00:00Z", exercises: [] },
//       { id: "session_knee_04", date: "2024-03-20T09:00:00Z", exercises: [] }
//     ]
//   };
  
  // Calculate progress for this program:
//   const progress = calculateProgressFromSessions(program.sessions);
//   console.log(`Progress: ${progress.toFixed(2)}%`); // Output will be based on the current date
  