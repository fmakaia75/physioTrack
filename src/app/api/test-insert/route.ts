
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
  // export async function updateOrInsertClient2(clients: Athlete[]) {
  // try {
  //   // Ensure database connection
  //   await connectDB();

  //   const bulkOps = clients.map((client) => {
  //     // Validate and convert ID
  //     const clientId = client.id ? 
  //       mongoose.Types.ObjectId.createFromHexString(client.id) : 
  //       new mongoose.Types.ObjectId();

  //     return {
  //       updateOne: {
  //         filter: { _id: clientId },
  //         update: { 
  //           $set: {
  //             name: client.name,
  //             email: client.email,
  //             // Map other fields as needed
  //             coach: client.id ? 
  //               mongoose.Types.ObjectId.createFromHexString(client.id) : 
  //               undefined,
  //             currentPrograms: client.currentPrograms,
  //             note: client.notes || ''
  //           }
  //         },
  //         upsert: true,
  //       },
  //     };
  //   });

  //   if (bulkOps.length > 0) {
  //     const result = await Client.bulkWrite(bulkOps);
  //     console.log("Bulk update result:", result);
  //     return result;
  //   } else {
  //     console.log("No clients to update");
  //     return { message: "No clients to update" };
  //   }
  // } catch (error) {
  //   console.error("Failed to insert or update client:", error);
  //   throw error;
  // }

//   export async function updateOrInsertProgram(programs: Training[]){}