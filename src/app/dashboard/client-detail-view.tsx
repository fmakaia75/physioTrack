"use client"; // This is a client component 👈🏽

import { AwaitedReactNode, experimental_taintObjectReference, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, Mail, FileText, Activity, BarChart2, FileDown } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import EditClientView from './edit-client-view';
import { generateWeeklyPlanPDF } from './generatePlanning';
import { getClientById, getProgByName } from '../data/MockData'; // Import mock data
import { Client,Program, Session, } from './page';
import { calculateProgressFromSessions } from '../functions/users';

// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
interface ClientDetailViewProps {
  clientId: number;
}

export default function ClientDetailView({ clientId }: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showEditClient, setShowEditClient] = useState(false)
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [program, setProgram] = useState<Session[] | undefined>(undefined);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  
  // Mock client data for simplicity
  useEffect(() => {
    const fetchedClient = getClientById(clientId);
    setClient(fetchedClient);
    if(fetchedClient){
      //if client has training already programmed
      if(fetchedClient.currentPrograms){
        const fetchedProg = getProgByName(fetchedClient.currentPrograms)
        setProgram(fetchedProg)
        setProgress(calculateProgressFromSessions(fetchedProg))
        console.log(progress)
      }
    }
  }, [clientId]);

  const handleViewWeeklyPlan = () => {
    if (client) {
      if(program){
        generateWeeklyPlanPDF({ clientName: client.name, program: program});
      }
    }
  };

  if (!client) return <div>Loading...</div>; // Show loading if client data is not available yet
   
  return (
    <div>
      {!showEditClient ? (
        <>
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Client Details</h1>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center" onClick={handleViewWeeklyPlan}>
                  <FileDown className="h-4 w-4 mr-2" />
                  View Weekly Plan
                </Button>
                <Button onClick={() => setShowEditClient(true)} variant="outline" className="flex items-center">
                  Edit Client
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={client.name} />
                      <AvatarFallback>{client.name.split(' ').map((n: any[]) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{client.name}</CardTitle>
                      <CardDescription>{client.notes}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                    {program && program.length >0 ? (<div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Next Training: {new Date(program[0].date).toLocaleDateString()}</span>
                    </div>): <div></div>
                    }
                    {/* <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Therapist: {client.therapist}</span>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Program Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
              // {/* <ChartContainer
              //   config={{
              //     progress: {
              //       label: "Progress",
              //       color: "hsl(var(--chart-1))",
              //     },
              //   }}
              //   className="h-[200px]"
              // >
              //   <ResponsiveContainer width="100%" height="100%">
              //     <LineChart data={client.progressData}>
              //       <XAxis dataKey="week" />
              //       <YAxis />
              //       <ChartTooltip content={<ChartTooltipContent />} />
              //       <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" strokeWidth={2} />
              //     </LineChart>
              //   </ResponsiveContainer>
              // </ChartContainer> */}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trainings">Trainings</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{client.notes}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="trainings">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Trainings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {program && program.length >0?
                      (program.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{session.id}</p>
                              <p className="text-sm text-gray-500">{new Date(session.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">experimental_taintObjectReference...</span>
                          </div>
                        </div>
                      ))): (<p className="text-gray-500">No upcoming trainings scheduled.</p>)
                    }
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Therapist Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{client.notes}</p>
                    <Button className="mt-4">Add New Note</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>) : (
        <div>
          {<EditClientView ClientName={client.name} ClientEmail={client.email} ClientPhone={client.phone} ClientProgram={client.upcomingPrograms![0].type} />}
        </div>
      )}
    </div>
  )
}