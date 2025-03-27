"use client"; // This is a client component 👈🏽

import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, Mail, FileText, Activity, BarChart2 } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ClientDetailView() {
  const [activeTab, setActiveTab] = useState("overview")

  const client = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    program: "Knee Rehabilitation",
    progress: 75,
    nextTraining: "2024-11-22T10:00:00",
    therapist: "Dr. Emily Smith",
    notes: "Patient is showing good progress in knee flexibility. Continue with current exercise regimen and gradually increase intensity.",
    progressData: [
      { week: 'Week 1', progress: 20 },
      { week: 'Week 2', progress: 35 },
      { week: 'Week 3', progress: 50 },
      { week: 'Week 4', progress: 65 },
      { week: 'Week 5', progress: 75 },
    ],
    upcomingTrainings: [
      // { date: "2024-11-22T10:00:00", type: "Check-up", location: "Room 2" },
      // { date: "2024-11-29T14:30:00", type: "Therapy Session", location: "Room 1" },
      // { date: "2024-12-06T11:00:00", type: "Progress Evaluation", location: "Room 3" },
    ]
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Details</h1>
        <Button variant="outline">Edit Client</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" alt={client.name} />
                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{client.name}</CardTitle>
                <CardDescription>{client.program}</CardDescription>
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
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {/* <span>Next Training: {new Date(client.nextTraining).toLocaleDateString()}</span> */}
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Therapist: {client.therapist}</span>
              </div>
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
                <span className="text-sm font-medium">{client.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
              </div>
              {/* <ChartContainer
                config={{
                  progress: {
                    label: "Progress",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={client.progressData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer> */}
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
                {client.upcomingTrainings.map((training, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{training.type}</p>
                        <p className="text-sm text-gray-500">{new Date(training.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{training.location}</span>
                    </div>
                  </div>
                ))}
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
  )
}