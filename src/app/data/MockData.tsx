import { mock } from "node:test";
import { Client, exampleSession, Session } from "../dashboard/page"; // Ensure Client is correctly imported
const kneeRehabSessions: Session[] = [
  {
    id: "session_knee_01",
    date: "2025-03-12T09:00:00Z",
    exercises: [
      { id: "ex_101", name: "Squats", description: "3 sets of 10 reps, assisted if needed" },
      { id: "ex_102", name: "Leg Raise", description: "3 sets of 15 reps, seated" },
      { id: "ex_103", name: "Hamstring Curls", description: "3 sets of 12 reps, 20kg" },
      { id: "ex_104", name: "Calf Raises", description: "3 sets of 20 reps, bodyweight" }
    ]
  },
  {
    id: "session_knee_02",
    date: "2025-04-01T09:00:00Z",
    exercises: [
      { id: "ex_105", name: "Step-Ups", description: "3 sets of 10 reps per leg" },
      { id: "ex_106", name: "Seated Knee Extensions", description: "3 sets of 12 reps, light resistance" },
      { id: "ex_107", name: "Foam Rolling", description: "5 minutes, targeting quadriceps and hamstrings" }
    ]
  }
];
const shoulderStrengthSessions: Session[] = [
  {
    id: "session_shoulder_01",
    date: "2025-03-25T10:00:00Z",
    exercises: [
      { id: "ex_201", name: "Overhead Press", description: "3 sets of 12 reps, 15kg" },
      { id: "ex_202", name: "Lateral Raises", description: "3 sets of 15 reps, 5kg" },
      { id: "ex_203", name: "Front Raises", description: "3 sets of 12 reps, 5kg" },
      { id: "ex_204", name: "Reverse Flys", description: "3 sets of 12 reps, 5kg" }
    ]
  },
  {
    id: "session_shoulder_02",
    date: "2025-03-19T13:00:00Z",
    exercises: [
      { id: "ex_205", name: "External Rotation", description: "3 sets of 15 reps, resistance band" },
      { id: "ex_206", name: "Face Pulls", description: "3 sets of 12 reps, light cable machine" },
      { id: "ex_207", name: "Dumbbell Shrugs", description: "3 sets of 15 reps, 10kg" }
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
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: new Date(1987, 9, 5),
      currentPrograms: [
        "Knee Rehabilitation",
        "Shoulder Strength"
      ],
      therapist: "Dr. Emily Smith",
      notes: "Patient is showing good progress in knee flexibility.",
      upcomingPrograms: [],
      pastPrograms: []

    },
    { 
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "345-678-9012",
      dateOfBirth: new Date(1990, 11, 31),
    },
    { 
      id: 4,
       name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", dateOfBirth: new Date(1985, 5, 15) },
    {
      id: 6,
      name: "Alex Wilson",
      email: "alex@example.com",
      phone: "678-901-2345",
      dateOfBirth: new Date(1987, 9, 5),
      currentPrograms: [
        "Core Stability"
      ],
      pastPrograms: [],
      upcomingPrograms: [],
    }
  ];

  return mockClients.find(client => client.id === clientId);
};
