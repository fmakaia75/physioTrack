import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AddClientViewProps = {
  setShowAddClient: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddClientView({setShowAddClient}: AddClientViewProps) {
  const [clientName, setClientName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [program, setProgram] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({
      clientName,
      email,
      phone,
      program,
    })
    // Reset form or close view after submission
    setShowAddClient(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="program">Assigned Program</Label>
            <Select onValueChange={setProgram} value={program}>
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="knee-rehab">Knee Rehabilitation</SelectItem>
                <SelectItem value="shoulder-strength">Shoulder Strength</SelectItem>
                <SelectItem value="back-pain">Back Pain Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Client</Button>
        </form>
      </CardContent>
    </Card>
  )
}