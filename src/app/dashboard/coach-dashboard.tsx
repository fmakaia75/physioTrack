"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Users, BarChart2, PlusCircle, Search, Bell, X, LayoutDashboard } from 'lucide-react'
import Link from "next/link"
import ClientDetailView from './client-detail-view'
import Dashboard from './dashboard'
import ScheduleTab from './schedule-tab2'
import { ClientFormModal } from '@/components/ClientFormModal'
import { ProgramFormModal } from '@/components/ProgramFormModal'
import ClientTab from './client-tab'
import { useEffect, useState } from 'react';
import { getCoachData, getCoachPrograms, getCoachTrainees, getError, getStatus } from "@/state/coach/coachSlice"
import { store } from "@/state/store"
import { setUpdate } from "@/state/physio/physioSlice"
import { ObjectId } from "bson";


export type Client = {
  _id: string;
  name: string;
  email: string;
  // phone: string;
  currentPrograms?: string[]; // Programmes en cours stockés entièrement
  // pastPrograms?: number[]; // Programmes passés stockés sous forme d’ID
  // upcomingPrograms?: String[]; // Programmes à venir stockés entièrement
  coach: string;
  notes?: string;
};

type Exercise = {
  _id: string
  name: string
  description: string
}

export type Session = {
  _id: string
  date: string
  exercises: Exercise[]
}


export type Program = {
  _id: string;
  name: string;
  type: string;
  coach: string;
  durationWeeks: number;
  sessions: Session[]; // Sessions stockées entièrement
  clients: string[]; // Liste des clients inscrits
};

// export const exampleSession: Session = {
//   id: "session_2023_05_15_001",
//   date: "2023-05-15T10:00:00Z",
//   exercises: [
//     {
//       id: "ex_001",
//       name: "Squats",
//       description: "3 sets of 12 reps, bodyweight"
//     },
//     {
//       id: "ex_002",
//       name: "Lunges",
//       description: "3 sets of 10 reps per leg, bodyweight"
//     },
//     {
//       id: "ex_003",
//       name: "Leg Press",
//       description: "3 sets of 15 reps, 100kg"
//     },
//     {
//       id: "ex_004",
//       name: "Calf Raises",
//       description: "3 sets of 20 reps, using body weight"
//     },
//     {
//       id: "ex_005",
//       name: "Hamstring Curls",
//       description: "3 sets of 12 reps, 30kg"
//     },
//     {
//       id: "ex_006",
//       name: "Plank",
//       description: "3 sets of 30 seconds hold"
//     }
//   ]
// }
// const initialPrograms: Program[] = [
//   { id: 1, name: "Knee Rehabilitation", type: "Rehab", durationWeeks: 6, clients: ["John Doe", "Jane Smith"], sessions: [] },
//   { id: 2, name: "Shoulder Strength", type: "Strength", durationWeeks: 8, clients: ["John Doe", "Mike Johnson"], sessions: [] },
//   { id: 3, name: "Back Pain Management", type: "Rehab", durationWeeks: 4, clients: ["Emily Brown", "Chris Lee"], sessions: [] },
//   {
//     id: 4, name: "Core Stability", type: "Strength", durationWeeks: 6, clients: ["Alex Wilson"], sessions: [
//       exampleSession
//     ]
//   },
// ]

export default function CoachDashboard() {
  //redux store variables
  const coachInfo = getCoachData();
  const programs = getCoachPrograms();
  const clients = getCoachTrainees();
  const status = getStatus();
  const error = getError();

  //Dashboard variables
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddClient, setShowAddClient] = useState(false)
  const [clientsState, setClientsState] = useState<Client[]>(clients)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false)
  const [programsState, setProgramsState] = useState<Program[]>(programs)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [initialStep, setInitialStep] = useState(1)


  console.log(programs);
  useEffect(() => {
    store.dispatch({ type: "INITIATE_FETCH" }); // ✅ Triggers listenerMiddleware
    setClientsState(clients)
    setProgramsState(programs)
  },[clients,programs]);

  // const initialClients: Client[] = [
  //   { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", dateOfBirth: new Date(1980, 0, 1), currentPrograms: ["Knee Rehabilitation", "Shoulder Strength"], },
  //   { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", dateOfBirth: new Date(1985, 5, 15), currentPrograms: ["Knee Rehabilitation"], },
  //   { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "345-678-9012", dateOfBirth: new Date(1990, 11, 31), currentPrograms: ["Shoulder Strength"], },
  //   { id: 4, name: "Emily Brown", email: "emily@example.com", phone: "456-789-0123", dateOfBirth: new Date(1988, 7, 22), currentPrograms: ["Back Pain Management"], },
  //   { id: 5, name: "Chris Lee", email: "chris@example.com", phone: "567-890-1234", dateOfBirth: new Date(1992, 3, 10), currentPrograms: ["Back Pain Management"], },
  //   { id: 6, name: "Alex Wilson", email: "alex@example.com", phone: "678-901-2345", dateOfBirth: new Date(1987, 9, 5), currentPrograms: ["Core Stability"], },
  // ]

  const handleSaveClient = (newClient: Client) => {
    console.log("we are here")
    if (newClient._id === "0") {
      // This is a new client
     
      newClient._id = new ObjectId().toString()
      setClientsState((prev) => [...prev, newClient])
    } else {
      // This is an existing client being updated
      setClientsState((prev) => prev.map((c) => (c._id === newClient._id ? newClient : c)))
    }
    store.dispatch(setUpdate({
      athletes: [newClient],
      programs: [],
      status: "idle",
      error: null
    }));

  }

  const handleSaveProgram = (updatedProgram: Program) => {
    if (updatedProgram._id === "0") {
      // This is a new program
      const newId = new ObjectId().toString();
      updatedProgram._id = newId
      
      setProgramsState((prev) => [...prev, updatedProgram])
    } else {
      // This is an existing program being updated
      setProgramsState((prev) => prev.map((p) => (p._id === updatedProgram._id ? updatedProgram : p)))
    }

    store.dispatch(setUpdate({
      athletes: [],
      programs: [updatedProgram],
      status: "idle",
      error: null
    }));
  }

  if (status != "succeeded") return <div>Loading...</div>;

  if (error != null) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 hidden md:block">
        <div className="flex items-center mb-6">
          <BarChart2 className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">XTrack</span>
        </div>
        <nav className="space-y-2">
          <Link
            href="#"
            className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'clients' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users className="h-5 w-5" />
            <span>Clients</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'schedule' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar className="h-5 w-5" />
            <span>Program</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'analytics' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {selectedClientId === null ? (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                username={coachInfo!.name}
                setShowAddClient={setShowAddClient}
                setActiveTab={setActiveTab}
                setIsProgramModalOpen={setIsProgramModalOpen}
                programsState={programsState}
                clientsState={clientsState}
              />
            )}
            {activeTab === 'clients' && (
              <ClientTab
                setIsClientModalOpen={setShowAddClient}
                clientsState={clientsState}
                setSeletedClient={setSelectedClientId}
                programsState={programsState}

              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleTab

                setIsProgramModalOpen={setIsProgramModalOpen}
                programsState={programsState}

                setSelectedProgram={setSelectedProgram}

                setInitialStep={setInitialStep}

                clientsState={clientsState}

              />
            )}
          </>
        ) : (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedClientId(null)
                setShowAddClient(false)
              }}
              className="mb-4"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>

            {selectedClientId !== null && <ClientDetailView clientId={selectedClientId} />}
          </div>
        )}
      </main>

      <ClientFormModal
        isOpen={showAddClient}
        onClose={() => setShowAddClient(false)}
        onSaveClient={handleSaveClient}
        programs={programsState}
        setProgramsState={setProgramsState}
        setClientsState={setClientsState}
        clients={clientsState}
        fromModal={false}
      />

      <ProgramFormModal
        //come from the actual layer
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        //used to save the new program
        onSaveProgram={handleSaveProgram}
        //can associate each client to the actual program
        clients={clientsState}
        //sync the client and associated program
        onSaveClient={handleSaveClient}
        programs={programsState}
        setProgramsState={setProgramsState}
        setClientsState={setClientsState}
        //init the step and use the initial program
        initialProgram={selectedProgram}
        initialStep={initialStep}
        fromModal={false}
      />
    </div>
  )
}
