import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditClientViewProps {
  ClientName: string;
  ClientPhone: string;
  ClientEmail: string;
  ClientProgram: string;
}

export default function EditClientView({ ClientName, ClientPhone, ClientEmail, ClientProgram }: EditClientViewProps) {
  const [name, setClientName] = useState(ClientName);
  const [email, setEmail] = useState(ClientEmail);
  const [phone, setPhone] = useState(ClientPhone);
  const [program, setProgram] = useState(ClientProgram);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, program }),
      });
      if (!response.ok) throw new Error('Update failed');
      setStatusMessage('Client updated successfully!');
    } catch {
      setStatusMessage('Failed to update client.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={name}
              onChange={(e) => setClientName(e.target.value)}
              required
              aria-label="Client Name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-label="Phone"
            />
          </div>
          <div>
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
          <Button type="submit">Update Client</Button>
        </form>
        {statusMessage && (
          <p className={`text-sm mt-4 ${statusMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {statusMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
