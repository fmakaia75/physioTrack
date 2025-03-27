"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, FolderPlus, Calendar, BarChart3, Users, Dumbbell, Bell } from 'lucide-react'
import { CompactWeeklySchedule } from "@/components/CompactWeeklySchedule"
import { Client, Program } from '@/app/dashboard/coach-dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// This would typically come from a database or API
const dashboardData = {
  totalClients: 150,
  activePrograms: 45,
  todaySessions: 28,
}

type DashboardProps = {
  username: string
  setShowAddClient: React.Dispatch<React.SetStateAction<boolean>>
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  setIsProgramModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  programsState: Program[]
  clientsState: Client[]
}

export default function Dashboard({
  username,
  setShowAddClient,
  setActiveTab,
  setIsProgramModalOpen,
  programsState,
  clientsState,
}: DashboardProps) {

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
  }
  // const { user, error, isLoading } = useUser();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center w-full">
        {/* Left-Aligned Buttons */}
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddClient(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
          <Button onClick={() => setIsProgramModalOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </div>

        {/* Right-Aligned Component */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Welcome, {username}</h1>
          <div className="flex items-center space-x-4">
            <a href="/api/auth/logout" className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </a>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Dr. Smith" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsState.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programsState.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todaySessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,560</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CompactWeeklySchedule setIsProgramModalOpen={setIsProgramModalOpen} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used functions for easy access.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full" onClick={() => handleTabChange("schedule")}>
              <Calendar className="mr-2 h-4 w-4" />
              View Full Schedule
            </Button>
            <Button className="w-full" onClick={() => handleTabChange("clients")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Clients
            </Button>
            <Button className="w-full" onClick={() => handleTabChange("schedule")}>
              <Dumbbell className="mr-2 h-4 w-4" />
              Manage Programs
            </Button>
            <Button className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}