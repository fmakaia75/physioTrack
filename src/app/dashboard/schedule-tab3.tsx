"use client"

import * as React from "react"
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, ChevronRight, Plus, Trash } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

type Exercise = {
  id: string
  name: string
  description: string
}

type Session = {
  id: string
  programId: string
  title: string
  date: Date
  exercises: Exercise[]
  color: string
}

type Program = {
  id: string
  name: string
  type: string
  sessions: Session[]
}

const ItemTypes = {
  SESSION: 'session',
}

const SessionCard: React.FC<{ 
  session: Session; 
  onMove: (id: string, date: Date) => void;
  onClick: () => void;
  showExercises: boolean;
}> = ({ session, onMove, onClick, showExercises }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SESSION,
    item: { id: session.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={cn(
        "rounded-md py-2 px-3 cursor-pointer shadow-sm",
        session.color,
        isDragging && "opacity-50"
      )}
    >
      <div className="font-medium text-sm">{session.title}</div>
      {showExercises ? (
        <div className="mt-2 space-y-1">
          {session.exercises.map((exercise, index) => (
            <div key={exercise.id} className="text-xs">
              <span className="font-medium">{index + 1}. {exercise.name}</span>
              <p className="text-muted-foreground">{exercise.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">{session.exercises.length} exercises</div>
      )}
    </div>
  )
}

const DayColumn: React.FC<{ 
  day: Date; 
  sessions: Session[]; 
  onMove: (id: string, date: Date) => void;
  onSessionClick: (session: Session) => void;
  showExercises: boolean;
}> = ({ day, sessions, onMove, onSessionClick, showExercises }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SESSION,
    drop: (item: { id: string }) => onMove(item.id, day),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={cn(
        "flex-1 min-w-[125px] rounded-lg shadow-sm",
        isOver && "bg-gray-100 dark:bg-gray-700"
      )}
    >
      <div className={cn(
        "p-2 sticky top-0 rounded-t-lg",
        day.toDateString() === new Date().toDateString() 
          ? "bg-gray-900 text-white dark:bg-black rounded-b-lg" 
          : "bg-gray-100 dark:bg-gray-700"
      )}>
        <div className="font-semibold">
          {day.toLocaleDateString('default', { weekday: 'short' })}
        </div>
        <div className="text-sm text-muted-foreground">
          {day.getDate()}
        </div>
      </div>
      <div className="px-1 py-2 space-y-2">
        {sessions.map((session) => (
          <SessionCard 
            key={session.id} 
            session={session} 
            onMove={onMove} 
            onClick={() => onSessionClick(session)}
            showExercises={showExercises}
          />
        ))}
      </div>
    </div>
  )
}

export default function ScheduleView() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [programs, setPrograms] = React.useState<Program[]>([
    {
      id: "1",
      name: "Knee Rehabilitation",
      type: "Rehab",
      sessions: [
        {
          id: "s1",
          programId: "1",
          title: "Knee Rehab Session 1",
          date: new Date(),
          exercises: [{ id: "e1", name: "Knee Flexion", description: "Bend knee slowly" }],
          color: "bg-blue-100 hover:bg-blue-200"
        },
        {
          id: "s2",
          programId: "1",
          title: "Knee Rehab Session 2",
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          exercises: [{ id: "e2", name: "Knee Extension", description: "Extend knee slowly" }],
          color: "bg-blue-100 hover:bg-blue-200"
        }
      ]
    },
    {
      id: "2",
      name: "Core Training",
      type: "Strength",
      sessions: [
        {
          id: "s3",
          programId: "2",
          title: "Core Strength Session",
          date: new Date(new Date().setDate(new Date().getDate() + 1)),
          exercises: [{ id: "e3", name: "Plank", description: "Hold plank position" }],
          color: "bg-green-100 hover:bg-green-200"
        }
      ]
    }
  ])
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [showExercises, setShowExercises] = React.useState(false)

  const getDaysInWeek = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }

  const weekDays = getDaysInWeek(selectedDate)

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const moveSession = (id: string, newDate: Date) => {
    setPrograms(prevPrograms =>
      prevPrograms.map(program => ({
        ...program,
        sessions: program.sessions.map(session =>
          session.id === id ? { ...session, date: newDate } : session
        )
      }))
    )
  }

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)
    setIsEditing(false)
  }

  const handleEditSession = () => {
    setIsEditing(true)
  }

  const handleSaveSession = () => {
    if (selectedSession) {
      setPrograms(prevPrograms =>
        prevPrograms.map(program => ({
          ...program,
          sessions: program.sessions.map(session =>
            session.id === selectedSession.id ? selectedSession : session
          )
        }))
      )
      setIsEditing(false)
    }
  }

  const handleDeleteSession = () => {
    if (selectedSession) {
      setPrograms(prevPrograms =>
        prevPrograms.map(program => ({
          ...program,
          sessions: program.sessions.filter(session => session.id !== selectedSession.id)
        }))
      )
      setSelectedSession(null)
    }
  }

  const handleAddExercise = () => {
    if (selectedSession) {
      const newExercise: Exercise = {
        id: `e${Date.now()}`,
        name: "",
        description: ""
      }
      setSelectedSession({
        ...selectedSession,
        exercises: [...selectedSession.exercises, newExercise]
      })
    }
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (selectedSession) {
      setSelectedSession({
        ...selectedSession,
        exercises: selectedSession.exercises.filter(exercise => exercise.id !== exerciseId)
      })
    }
  }

  const handleExerciseChange = (exerciseId: string, field: 'name' | 'description', value: string) => {
    if (selectedSession) {
      setSelectedSession({
        ...selectedSession,
        exercises: selectedSession.exercises.map(exercise =>
          exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise
        )
      })
    }
  }

  const allSessions = programs.flatMap(program => program.sessions)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-exercises"
                checked={showExercises}
                onCheckedChange={setShowExercises}
              />
              <Label htmlFor="show-exercises">Show Exercises</Label>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="flex h-full gap-4">
              {weekDays.map((day) => (
                <DayColumn
                  key={day.toISOString()}
                  day={day}
                  sessions={allSessions.filter(session => session.date.toDateString() === day.toDateString())}
                  onMove={moveSession}
                  onSessionClick={handleSessionClick}
                  showExercises={showExercises}
                />
              ))}
            </div>
          </div>
        </div>
        <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Session" : selectedSession?.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {isEditing ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        id="title"
                        value={selectedSession?.title}
                        onChange={(e) => setSelectedSession(prev => prev ? {...prev, title: e.target.value} : null)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedSession?.date.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedSession(prev => prev ? {...prev, date: new Date(e.target.value)} : null)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="program" className="text-right">Program</Label>
                      <Select
                        value={selectedSession?.programId}
                        onValueChange={(value) => setSelectedSession(prev => prev ? {...prev, programId: value} : null)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map(program => (
                            <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Exercises</h4>
                        <Button onClick={handleAddExercise} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Exercise
                        </Button>
                      </div>
                      {selectedSession?.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="grid gap-2 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">Exercise {index + 1}</h5>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteExercise(exercise.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Exercise name"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                          />
                          <Textarea
                            placeholder="Exercise description"
                            value={exercise.description}
                            onChange={(e) => handleExerciseChange(exercise.id, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Program:</span>
                    <span className="col-span-3">{programs.find(p => p.id === selectedSession?.programId)?.name}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="col-span-3">{selectedSession?.date.toLocaleDateString()}</span>
                  </div>
                  <div className="grid gap-4">
                    <h4 className="font-semibold">Exercises:</h4>
                    {selectedSession?.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="border p-2 rounded-md mt-2">
                        <h5 className="font-medium">Exercise {index + 1}: {exercise.name}</h5>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              {isEditing ? (
                <Button onClick={handleSaveSession}>Save Changes</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleEditSession}>Edit</Button>
                  <Button variant="destructive" onClick={handleDeleteSession}>Delete</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  )
}