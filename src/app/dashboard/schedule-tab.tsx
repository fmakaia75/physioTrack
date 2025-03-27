import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Filter, CalendarIcon, Users, Dumbbell } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data
const programs = [
  { id: 1, name: "Knee Rehabilitation", type: "Rehab", clients: ["John Doe", "Jane Smith"] },
  { id: 2, name: "Shoulder Strength", type: "Strength", clients: ["Mike Johnson"] },
  { id: 3, name: "Back Pain Management", type: "Rehab", clients: ["Emily Brown", "Chris Lee"] },
  { id: 4, name: "Core Stability", type: "Strength", clients: ["Alex Wilson"] },
]

const clients = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
  { id: 4, name: "Emily Brown" },
  { id: 5, name: "Chris Lee" },
  { id: 6, name: "Alex Wilson" },
]

export default function ScheduleTab() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedType, setSelectedType] = useState<string | undefined>()
  const [selectedClient, setSelectedClient] = useState<string | undefined>()
  const [selectedProgram, setSelectedProgram] = useState<{ id: number; name: string } | null>(null)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [selectedClients, setSelectedClients] = useState([])

  const filteredPrograms = programs.filter(program => 
    (!selectedType || program.type === selectedType) &&
    (!selectedClient || program.clients.includes(selectedClient)) &&
    (!selectedProgram || program.name === selectedProgram.name)
  )

  const handleAddClients = () => {
    if (selectedProgram) {
      const updatedPrograms = programs.map(program => {
        if (program.id === selectedProgram.id) {
          return {
            ...program,
            clients: [...new Set([...program.clients, ...selectedClients])]
          }
        }
        return program
      })
      // In a real application, you would update the programs in your state management system or backend here
      console.log("Updated programs:", updatedPrograms)
    }
    setIsAddClientModalOpen(false)
    setSelectedProgram(null)
    setSelectedClients([])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programs and Schedule</h2>
        <div className="flex space-x-2">
          <Select onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Program Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rehab">Rehab</SelectItem>
              <SelectItem value="Strength">Strength</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map(program => (
                <SelectItem key={program.id} value={program.name}>{program.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">
            <Dumbbell className="mr-2 h-4 w-4" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" />
            Clients
          </TabsTrigger>
        </TabsList>
        <TabsContent value="programs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Programs Created</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Program
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrograms.map(program => (
                  <Card key={program.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{program.name}</h3>
                        <p className="text-sm text-gray-500">{program.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {program.clients.map((client, index) => (
                            <Avatar key={index} className="border-2 border-background">
                              <AvatarFallback>{client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProgram({ id: program.id, name: program.name })}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add Client
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Clients to {selectedProgram?.name}</DialogTitle>
                              <DialogDescription>
                                Select one or more clients to add to this program.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {clients.map((client) => (
                                <div key={client.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`client-${client.id}`}
                                    // checked={selectedClients.includes(client.name)}
                                    onCheckedChange={(checked) => {
                                      // setSelectedClients(
                                      //   checked
                                      //     ? [...selectedClients, client.name]
                                      //     : selectedClients.filter((name) => name !== client.name)
                                      // )
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
                            </div>
                            <Button onClick={handleAddClients}>Add Selected Clients</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Trainings on {date?.toDateString()}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span>John Doe - Knee Rehabilitation</span>
                      <Badge>10:00 AM</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span>Jane Smith - Shoulder Strength</span>
                      <Badge>2:00 PM</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map(client => (
                  <Card key={client.id}>
                    <CardContent className="flex items-center space-x-4 p-4">
                      <Avatar>
                        <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-gray-500">
                          {programs.find(p => p.clients.includes(client.name))?.name || 'No program assigned'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}