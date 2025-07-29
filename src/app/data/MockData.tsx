import { mock } from "node:test";
import { Client, Program, Session } from '../dashboard/coach-dashboard' // Ensure Client is correctly imported
const kneeRehabSessions: Session[] = [
  {
    _id: "session_knee_01",
    date: "2025-06-22T09:00:00Z",
    exercises: [
      { _id: "ex_101", name: "Squats", description: "3 sets of 10 reps, assisted if needed" },
      { _id: "ex_102", name: "Leg Raise", description: "3 sets of 15 reps, seated" },
      { _id: "ex_103", name: "Hamstring Curls", description: "3 sets of 12 reps, 20kg" },
      { _id: "ex_104", name: "Calf Raises", description: "3 sets of 20 reps, bodyweight" }
    ]
  },
  {
    _id: "session_knee_02",
    date: "2025-06-23T09:00:00Z",
    exercises: [
      { _id: "ex_105", name: "Step-Ups", description: "3 sets of 10 reps per leg" },
      { _id: "ex_106", name: "Seated Knee Extensions", description: "3 sets of 12 reps, light resistance" },
      { _id: "ex_107", name: "Foam Rolling", description: "5 minutes, targeting quadriceps and hamstrings" }
    ]
  }
];
const shoulderStrengthSessions: Session[] = [
  {
    _id: "session_shoulder_01",
    date: "2025-06-25T10:00:00Z",
    exercises: [
      { _id: "ex_201", name: "Overhead Press", description: "3 sets of 12 reps, 15kg" },
      { _id: "ex_202", name: "Lateral Raises", description: "3 sets of 15 reps, 5kg" },
      { _id: "ex_203", name: "Front Raises", description: "3 sets of 12 reps, 5kg" },
      { _id: "ex_204", name: "Reverse Flys", description: "3 sets of 12 reps, 5kg" }
    ]
  },
  {
    _id: "session_shoulder_02",
    date: "2025-06-26T13:00:00Z",
    exercises: [
      { _id: "ex_205", name: "External Rotation", description: "3 sets of 15 reps, resistance band" },
      { _id: "ex_206", name: "Face Pulls", description: "3 sets of 12 reps, light cable machine" },
      { _id: "ex_207", name: "Dumbbell Shrugs", description: "3 sets of 15 reps, 10kg" }
    ]
  }
];

const mockProgramsDB = [
  {
    id: 1,
    name: "Knee Rehabilitation",
    type: "Rehab",
    durationWeeks: 6,
    clients: ["John Doe", "Jane Smith"],
    sessions: kneeRehabSessions
  },
  {
    id: 2,
    name: "Shoulder Strength",
    type: "Strength",
    durationWeeks: 8,
    clients: ["John Doe","Mike Johnson"],
    sessions: shoulderStrengthSessions
  }
];
// Fonction pour récupérer les sessions associées aux programmes donnés
export const getProgByName = (progNames: String[]): Session[] => {
  if (!progNames || progNames.length === 0) return []; // Vérifier que la liste n'est pas vide

  // Filtrer les programmes existants qui correspondent aux noms donnés
  const matchingPrograms = mockProgramsDB.filter((program) =>
    progNames.includes(program.name)
  );

  // Extraire et retourner toutes les sessions associées aux programmes trouvés
  console.log("Final Sorted Sessions:", matchingPrograms.flatMap(p => p.sessions).filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

  return matchingPrograms
  .flatMap((program) => program.sessions)
  .filter((session) => new Date(session.date.replace(" ", "")) >= new Date())  // Corrige l'espace si besoin
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};


// Mock function to get a client by ID
export const getClientById = (clientId: number): Client | undefined => {
  const mockClients: Client[] = [
    {
      _id:"6856e80ecb6a3ee553441a0e",
      name: "John Doe",
      email: "john.doe@example.com",
      currentPrograms: [
        "Knee Rehabilitation",
        "Shoulder Strength"
      ],
      coach: "Dr. Emily Smith",
      notes: "Patient is showing good progress in knee flexibility.",

    },
    { 
      _id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
    
      coach:"Dr. Emily Smith"
    },
    { 
      _id: "4",
       name: "Jane Smith", email: "jane@example.com", coach:"Dr. Emily Smith" },
    {
      _id: "6",
      name: "Alex Wilson",
      email: "alex@example.com",
      
      currentPrograms: [
        "Core Stability"
      ],
      coach:"Dr. Emily Smith"
    }
  ];

  return mockClients.find(client => parseInt(client._id) === clientId);
};
