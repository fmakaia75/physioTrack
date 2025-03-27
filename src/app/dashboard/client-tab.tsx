"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {  PlusCircle } from 'lucide-react'

import { Client, Program } from './coach-dashboard'

type ClientTabProps= {
    setIsClientModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
    clientsState: Client[],
    setSeletedClient: React.Dispatch<React.SetStateAction<number | null>>,
    programsState: Program[]
}

export default function ClientTab({clientsState, setIsClientModalOpen,setSeletedClient,programsState}: ClientTabProps){
    const [searchQuery, setSearchQuery] = useState("")
    const filteredClients = clientsState.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const handleOpenClient= ()=> {
        setIsClientModalOpen(true)
    }
    return (<div className="space-y-4">
    <div className="flex items-start space-y-2">
      <Button onClick={() => handleOpenClient()}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Client
      </Button>
    </div>

    {/* Client List */}
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.currentPrograms!.map(p => programsState.find(prog => prog.name === p)?.name).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{client.progress}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSeletedClient(client.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>)
}