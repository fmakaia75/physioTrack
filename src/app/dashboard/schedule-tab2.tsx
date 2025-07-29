"use client"

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Search, UserPlus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Client, Program } from './coach-dashboard'

type ScheduleTabProps = {
    // setShowAddClient: React.Dispatch<React.SetStateAction<boolean>>
    // isProgramModalOpen: boolean
    setIsProgramModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    programsState: Program[]
    // setProgramsState: React.Dispatch<React.SetStateAction<Program[]>>
    // selectedProgram: Program | null
    setSelectedProgram: React.Dispatch<React.SetStateAction<Program | null>>
    // initialStep: number
    setInitialStep: React.Dispatch<React.SetStateAction<number>>
    // handleSaveProgram: (updatedProgram: Program) => void
    clientsState: Client[]
    // setClientsState: React.Dispatch<React.SetStateAction<Client[]>>
}

export default function ScheduleTab({
    // setShowAddClient,
    // isProgramModalOpen,
    setIsProgramModalOpen,
    programsState,
    // setProgramsState,
    // selectedProgram,
    setSelectedProgram,
    // initialStep,
    setInitialStep,
    // handleSaveProgram,
    clientsState,
    // setClientsState
}: ScheduleTabProps) {
    const [selectedType, setSelectedType] = useState<string | undefined>()
    const [selectedClient, setSelectedClient] = useState<string | undefined>()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredPrograms = useMemo(() => {
        return programsState.filter(program =>
        ((!selectedType || program.type === selectedType) &&
            (!selectedClient || program.clients.includes(selectedClient)) &&
            program.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [programsState, selectedType, selectedClient, searchQuery])

    const handleOpenModal = (program: Program | null, step: number) => {
        setSelectedProgram(program)
        setInitialStep(step)
        setIsProgramModalOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start space-y-2">
                <Button onClick={() => handleOpenModal(null, 1)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Program
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                        <div className="flex-1 relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                className="pl-8"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={(value) => setSelectedType(value === "all" ? undefined : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Rehab">Rehab</SelectItem>
                                <SelectItem value="Strength">Strength</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setSelectedClient(value === "all" ? undefined : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Clients</SelectItem>
                                {clientsState.map(client => (
                                    <SelectItem key={client._id} value={client.name}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredPrograms.map(program => (
                            <Card key={program._id}>
                                <CardContent className="flex justify-between items-center p-4">
                                    <div>
                                        <h3 className="font-semibold">{program.name}</h3>
                                        <p className="text-sm text-muted-foreground">{program.type}</p>
                                        <p className="text-sm text-muted-foreground">{program.durationWeeks} weeks</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex -space-x-2">
                                            {program.clients.map((clientId) => (
                                                clientsState.map(client => {
                                                    if (clientId == client._id) {
                                                        return (
                                                            <Avatar key={clientId} className="border-2 border-background">
                                                                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                        )
                                                    }
                                                }
                                                )
                                            )
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenModal(program, 2)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Modify
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenModal(program, 3)}
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Associate Client
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}