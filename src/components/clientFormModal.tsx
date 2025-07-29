"use client"

import { useState, useEffect, SetStateAction } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {  PlusCircle } from 'lucide-react'

import { Program, Client } from '@/app/dashboard/coach-dashboard'
import { ProgramFormModal } from './ProgramFormModal'
import { getCoachData } from '@/state/coach/coachSlice'

type ClientFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSaveClient: (client: Client) => void
  // onSaveProgram: (program: Program)=>void
  initialClient?: Client | null
  programs: Program[]
  clients: Client[]
  setClientsState: React.Dispatch<React.SetStateAction<Client[]>>
  setProgramsState: React.Dispatch<React.SetStateAction<Program[]>>
  fromModal: boolean
}



export function ClientFormModal({ isOpen, onClose, onSaveClient, initialClient, programs,clients, setProgramsState,fromModal, setClientsState  }: ClientFormModalProps) {
  const emptyClient: Client = {
    _id: "0",
    name: '',
    email: '',
    coach: getCoachData()!._id,
    currentPrograms: [],
  }

  const [client, setClient] = useState<Client>(emptyClient)
  const [step, setStep] = useState(1)
  const [showProgramModal, setShowProgramModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setClient(initialClient || emptyClient)
      setStep(1)
    }
  }, [isOpen, initialClient])

  const handleSaveClient = () => {
    onSaveClient(client)
    // Update programs with the client
    const updatedPrograms = programs.map((program) => {
      if (client.currentPrograms!.includes(program._id)) {
        // Add client if not already present
        return {
          ...program,
          clients: [...new Set([...program.clients, client._id])],
        };
      } else {
        // Remove client if they are no longer associated
        return {
          ...program,
          clients: program.clients.filter((id) => id !== client._id),
        };
      }
    });
    setProgramsState(updatedPrograms);
    onClose()
  }

  const canProceedToNextStep = () => {
    return client.name && client.email
  }
  const onCreateProgram = () => {
    setShowProgramModal(true)
  }
  const handleSaveProgram = (newProgram: Program) => {
    setProgramsState((prev) => [...prev, newProgram]); // Add program
    setClient((prev) => ({ ...prev, currentPrograms: [...prev.currentPrograms!, newProgram._id] })); // Associate program
    // setShowProgramModal(false); // Close ProgramFormModal only
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{initialClient ? 'Modify Client' : 'Create New Client'}</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Enter the client's personal information" : "Assign programs to the client"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={client.name}
                onChange={(e) => setClient(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={client.email}
                onChange={(e) => setClient(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={client.phone}
                onChange={(e) => setClient(prev => ({ ...prev, phone: e.target.value }))}
                className="col-span-3"
              />
            </div> */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 justify-start text-left font-normal ${!client.dateOfBirth && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {client.dateOfBirth ? format(client.dateOfBirth, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={client.dateOfBirth}
                    onSelect={(date) => date && setClient(prev => ({ ...prev, dateOfBirth: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div> */}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Assign Programs</h4>
              <Button onClick={onCreateProgram} disabled={fromModal} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Program
              </Button>
            </div>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {programs.map((program) => (
                <div key={program._id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`program-${program._id}`}
                    checked={client.currentPrograms!.includes(program._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setClient(prev => ({ ...prev, currentPrograms: [...prev.currentPrograms!, program._id] }))
                      } else {
                        setClient(prev => ({ ...prev, currentPrograms: prev.currentPrograms!.filter(c => c !== program._id) }))
                      }
                    }}
                  />
                  <label
                    htmlFor={`program-${program._id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {program.name}
                  </label>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        <DialogFooter>
          {step === 1 ? (
            <div className="flex justify-between w-full">
              <Button type="button" onClick={handleSaveClient}>
                Create Client
              </Button>
              <Button type="button" onClick={() => setStep(2)} disabled={!canProceedToNextStep()}>
                Associate Programs
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button type="button" onClick={handleSaveClient}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
      {showProgramModal && <ProgramFormModal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
        clients={clients}
        programs={programs}
        onSaveProgram={handleSaveProgram}
        onSaveClient={handleSaveClient}      
        setProgramsState={setProgramsState} initialProgram={null} initialStep={1}
        fromModal={true}
        setClientsState={setClientsState}
        />}
    </Dialog>
  )
}