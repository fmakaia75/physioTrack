"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from 'lucide-react'
import { ClientFormModal } from './ClientFormModal'
import { Client, Program } from '@/app/dashboard/coach-dashboard'
import { getCoachData } from '@/state/coach/coachSlice'
import { ObjectId } from "bson";


type ProgramFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveProgram: (program: Program) => void;
  clients: Client[];
  programs: Program[];
  setClientsState: React.Dispatch<React.SetStateAction<Client[]>>;
  setProgramsState: React.Dispatch<React.SetStateAction<Program[]>>;
  initialProgram: Program | null;
  initialStep: number;
  onSaveClient: (client: Client) => void;

  fromModal: boolean;
}



export function ProgramFormModal({ isOpen, onClose, onSaveProgram, clients, initialProgram, initialStep, onSaveClient, programs, setProgramsState, fromModal, setClientsState }: ProgramFormModalProps) {
  const emptyProgram: Program = {
    id: "0",
    name: '',
    type: '',
    coach: getCoachData()!.id,
    durationWeeks: 1,
    sessions: [],
    clients: [],
  }

  const [step, setStep] = useState(initialStep)
  const [program, setProgram] = useState<Program>(emptyProgram)
  const [showClientModal, setShowClientModal] = useState(false)
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep)
      setProgram(initialProgram || emptyProgram)
    }
  }, [isOpen, initialProgram, initialStep])

  const handleAddSession = () => {
    setProgram(prev => ({
      ...prev,
      sessions: [...prev.sessions, { _id: new ObjectId().toString(), date: new Date().toISOString().split('T')[0], exercises: [] }],
    }))
  }

  
  const handleAddExercise = (sessionId: string) => {
    setProgram(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => 
        session._id === sessionId
          ? { ...session, exercises: [...session.exercises, { _id: new ObjectId().toString(), name: '', description: '' }] }
          : session
      ),
    }))
  }

  const handleRemoveExercise = (sessionId: string, exerciseId: string) => {
    setProgram(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => 
        session._id === sessionId
          ? { ...session, exercises: session.exercises.filter(exercise => exercise._id !== exerciseId) }
          : session
      ),
    }))
  }

  const handleSaveProgram = () => {
    onSaveProgram(program)
    // Update the clients' programs field
  const updatedClients = clients.map(client => {
    if (program.clients.includes(client.name)) {
      // Add the program ID to the client's programs array if it's not already there
      if (!client.currentPrograms!.includes(program.name)) {
        return {
          ...client,
          programs: [...client.currentPrograms!, program.name],
        };
      }
    } else {
      // Remove the program ID from the client's programs array if it's no longer associated
      if (client.currentPrograms!.includes(program.name)) {
        return {
          ...client,
          programs: client.currentPrograms!.filter(progId => progId !== program.name),
        };
      }
    }
    return client; // Return unchanged client if no updates are needed
  });

  // Save the updated clients back to the state
  // updatedClients.forEach(onSaveClient);
  setClientsState(updatedClients)
  // Close the modal
  onClose()
  }

  const handleCreateClient = () => {
    setShowClientModal(true)
  }

  const canProceedToNextStep = () => {
    if (step === 1) {
      return program.name && program.type && program.durationWeeks > 0
    }
    if (step === 2) {
      return program.sessions.length > 0 && program.sessions.every(session => 
        session.exercises.length > 0 && session.exercises.every(exercise => exercise.name)
      )
    }
    return true
  }

  const hasValidSessions = program.sessions.length > 0 && program.sessions.every(session => 
    session.exercises.length > 0 && session.exercises.every(exercise => exercise.name))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{initialProgram ? 'Modify Program' : 'Create New Program'}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the program details"}
            {step === 2 && "Add sessions and exercises"}
            {step === 3 && "Select clients for the program"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={program.name}
                onChange={(e) => setProgram(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={program.type}
                onValueChange={(value) => setProgram(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rehab">Rehab</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (weeks)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={program.durationWeeks}
                onChange={(e) => setProgram(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) }))}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <ScrollArea className="h-[400px] pr-4">
            {program.sessions.map((session, index) => (
              <div key={session._id} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Session {index + 1}</h4>
                  <Input
                    type="date"
                    value={session.date}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setProgram(prev => ({
                        ...prev,
                        sessions: prev.sessions.map(s => s._id === session._id ? { ...s, date: newDate.toISOString().split('T')[0] } : s),
                      }));
                    }}
                    className="w-auto"
                  />
                </div>
                {session.exercises.map((exercise, exerciseIndex) => (
                  <div key={exercise._id} className="mb-4 p-2 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">Exercise {exerciseIndex + 1}</h5>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(session._id, exercise._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => setProgram(prev => ({
                        ...prev,
                        sessions: prev.sessions.map(s => 
                          s._id === session._id
                            ? {
                                ...s,
                                exercises: s.exercises.map(ex => 
                                  ex._id === exercise._id ? { ...ex, name: e.target.value } : ex
                                ),
                              }
                            : s
                        ),
                      }))}
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="Exercise description"
                      value={exercise.description}
                      onChange={(e) => setProgram(prev => ({
                        ...prev,
                        sessions: prev.sessions.map(s => 
                          s._id === session._id
                            ? {
                                ...s,
                                exercises: s.exercises.map(ex => 
                                  ex._id === exercise._id ? { ...ex, description: e.target.value } : ex
                                ),
                              }
                            : s
                        ),
                      }))}
                    />
                  </div>
                ))}
                <Button onClick={() => handleAddExercise(session._id)} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </div>
            ))}
            <Button onClick={handleAddSession} variant="outline" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Session
            </Button>
          </ScrollArea>
        )}
        {step === 3 && (
          <ScrollArea className="h-[400px]">
            <div className="grid gap-4 py-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`client-${client.id}`}
                    checked={program.clients.includes(client.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProgram(prev => ({ ...prev, clients: [...prev.clients, client.name] }))
                      } else {
                        setProgram(prev => ({ ...prev, clients: prev.clients.filter(c => c !== client.name) }))
                      }
                    }}
                  />
                  <label
                    htmlFor={`client-${client.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {client.name}
                  </label>
                </div>
              ))}
              <Button onClick={handleCreateClient} disabled={fromModal} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Create New Client
              </Button>
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="space-x-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(prev => prev - 1)}>
                  Previous
                </Button>
              )}
              {step === 2 && (
                <Button type="button" onClick={handleSaveProgram} disabled={!hasValidSessions}>
                  {initialProgram ? 'Save Changes' : 'Create New Program'}
                </Button>
              )}
            </div>
            <div className="space-x-2">
              {step === 1 && (
                <Button type="button" onClick={() => setStep(prev => prev + 1)} disabled={!canProceedToNextStep()}>
                  Next
                </Button>
              )}
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(prev => prev + 1)} disabled={!canProceedToNextStep()}>
                  Associate client(s)
                </Button>
              )}
              {step === 3 && (
                <Button type="button" onClick={handleSaveProgram} disabled={!hasValidSessions}>
                  {initialProgram ? 'Save Changes' : 'Create Program'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
      {showClientModal && <ClientFormModal
        //come from the actual component
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        //come from the layer above
        onSaveClient={onSaveClient}
        programs={programs}
        setProgramsState={setProgramsState}
        setClientsState={setClientsState}
        // onSaveProgram={()=>{}}
        // onCreateProgram={() => {}}
        //to associate those clients to new program
        clients={clients}
        //be able to know if you can createa program from this modal
        fromModal={true}

      />}
    </Dialog>
  )
}