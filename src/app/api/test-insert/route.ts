
import { connectDB } from '@/lib/mongodb';
import { updateOrInsertClient, updateOrInsertProgram } from '@/lib/utils/dbHelpers';
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
      await connectDB(); // Ensure DB connection

      const { clients, programs } = await req.json();

      if (clients && clients.length > 0) {
          await updateOrInsertClient(clients);
      }
      if (programs && programs.length > 0) {
          await updateOrInsertProgram(programs);
      }

      return NextResponse.json({ message: "Update successful" }, { status: 200 });

  } catch (error) {
      console.error("Error in /api/test-insert:", error);
      return NextResponse.json({ message: "Update failed", error }, { status: 500 });
  }
}