import mongoose from "mongoose";
import Client from "@/models/Client";
import Program from "@/models/Program";
import { connectDB } from "@/lib/mongodb";

import type { Client as Athlete } from "@/app/dashboard/coach-dashboard";
import type { Program as Training } from "@/app/dashboard/coach-dashboard";

/**
 * Inserts or updates multiple clients in the database.
 * @param clients - Array of client objects to insert or update.
 */
export async function updateOrInsertClient(clients: Athlete[]) {
    try {
        await connectDB(); // Ensure database connection
        
        const bulkOps = clients.map((client) => {
            const clientId = client.id 
                ? new mongoose.Types.ObjectId(client.id) 
                : new mongoose.Types.ObjectId(); 

            return {
                updateOne: {
                    filter: { _id: clientId },
                    update: { 
                        $set: {
                            name: client.name,
                            email: client.email,
                            coach: new mongoose.Types.ObjectId(client.coach),
                            currentPrograms: client.currentPrograms || [],
                            notes: client.notes || "",
                        }
                    },
                    upsert: true, 
                },
            };
        });

        if (bulkOps.length > 0) {
            const result = await Client.bulkWrite(bulkOps);
            console.log("✅ Bulk update result:", result);
            return result;
        } else {
            console.log("⚠ No clients to update");
            return { message: "No clients to update" };
        }
    } catch (error) {
        console.error("❌ Failed to insert or update clients:", error);
        throw error;
    }
}

/**
 * Inserts or updates multiple programs in the database.
 * @param programs - Array of program objects to insert or update.
 */
export async function updateOrInsertProgram(programs: Training[]) {
    try {
        await connectDB(); // Ensure database connection
        
        const bulkOps = programs.map((program) => {
            const programId = program.id 
                ? new mongoose.Types.ObjectId(program.id) 
                : new mongoose.Types.ObjectId(); 

            return {
                updateOne: {
                    filter: { _id: programId },
                    update: { 
                        $set: {
                            name: program.name,
                            type: program.type,
                            coach: program.coach,
                            durationWeeks: program.durationWeeks,
                            sessions: program.sessions, // Store session array
                            clients: program.clients.map(clientId => new mongoose.Types.ObjectId(clientId)),
                        }
                    },
                    upsert: true, 
                },
            };
        });

        if (bulkOps.length > 0) {
            const result = await Program.bulkWrite(bulkOps);
            console.log("✅ Bulk update result (Programs):", result);
            return result;
        } else {
            console.log("⚠ No programs to update");
            return { message: "No programs to update" };
        }
    } catch (error) {
        console.error("❌ Failed to insert or update programs:", error);
        throw error;
    }
}

