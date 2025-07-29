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
    const session = await mongoose.startSession();

    try {
        await connectDB();

        return await session.withTransaction(async () => {
            // 1. PREMIÈRE ÉTAPE : Récupérer les anciens états AVANT la mise à jour
            const oldClientStates = new Map();
            
            for (const client of clients) {
                if (client._id) {
                    const oldClient = await Client.findById(new mongoose.Types.ObjectId(client._id))
                        .session(session);
                    if (oldClient) {
                        oldClientStates.set(client._id.toString(), oldClient);
                        console.log(`👤 Saved old state for client ${client._id}:`, {
                            name: oldClient.name,
                            currentPrograms: oldClient.currentPrograms?.map(p => p.toString()) || []
                        });
                    }
                }
            }

            // 2. Préparer les opérations bulk pour les clients
            const bulkOps = clients.map((client) => {
                const clientId = client._id
                    ? new mongoose.Types.ObjectId(client._id)
                    : new mongoose.Types.ObjectId();
                
                return {
                    updateOne: {
                        filter: { _id: clientId },
                        update: {
                            $set: {
                                name: client.name,
                                email: client.email,
                                coach: new mongoose.Types.ObjectId(client.coach),
                                currentPrograms: (client.currentPrograms || []).map(p => 
                                    new mongoose.Types.ObjectId(p)
                                ),
                                notes: client.notes || "",
                                updatedAt: new Date(),
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                            }
                        },
                        upsert: true,
                    },
                };
            });

            // 3. Exécuter les opérations sur les clients
            let clientResult = null;
            if (bulkOps.length > 0) {
                clientResult = await Client.bulkWrite(bulkOps, { session });
                console.log("✅ Bulk update result (Clients):", clientResult);
            }

            // 4. Synchroniser les programmes
            const programUpdates = [];

            for (const client of clients) {
                // Récupérer le client mis à jour
                const currentClient = await Client.findOne(
                    client._id
                        ? { _id: new mongoose.Types.ObjectId(client._id) }
                        : { email: client.email }
                ).session(session);

                if (!currentClient) continue;

                // Utiliser l'ancien état sauvegardé
                const oldClient = client._id ? oldClientStates.get(client._id.toString()) : null;
                
                // ✅ CORRECTION : Convertir en strings pour la comparaison
                const oldProgramIds: string[] = (oldClient?.currentPrograms || []).map((id: any) => id.toString());
                const newProgramIds: string[] = (client.currentPrograms || []).map(id => id.toString());

                console.log("Old program IDs for client:", oldProgramIds);
                console.log("New program IDs for client:", newProgramIds);

                // Programmes à retirer du client
                const programIdsToRemove = oldProgramIds.filter(
                    (oldId: string) => !newProgramIds.includes(oldId)
                );

                // Programmes à ajouter au client
                const programIdsToAdd = newProgramIds.filter(
                    (newId: string) => !oldProgramIds.includes(newId)
                );

                console.log("Programs to remove client from:", programIdsToRemove);
                console.log("Programs to add client to:", programIdsToAdd);

                // ✅ CORRECTION : Convertir back en ObjectId pour les requêtes
                const programsToRemoveFrom = programIdsToRemove.map(id => new mongoose.Types.ObjectId(id));
                const programsToAddTo = programIdsToAdd.map(id => new mongoose.Types.ObjectId(id));

                const actualClientId = currentClient._id;
                console.log("Using client ID for program updates:", actualClientId);

                // Retirer le client des anciens programmes
                if (programsToRemoveFrom.length > 0) {
                    console.log("Removing client from programs:", programsToRemoveFrom.map(p => p.toString()));
                    programUpdates.push({
                        updateMany: {
                            filter: { _id: { $in: programsToRemoveFrom } },
                            update: {
                                $pull: { clients: actualClientId }
                            }
                        }
                    });
                }

                // Ajouter le client aux nouveaux programmes
                if (programsToAddTo.length > 0) {
                    console.log("Adding client to programs:", programsToAddTo.map(p => p.toString()));
                    programUpdates.push({
                        updateMany: {
                            filter: { _id: { $in: programsToAddTo } },
                            update: {
                                $addToSet: { clients: actualClientId }
                            }
                        }
                    });
                }
            }

            // 5. Exécuter les mises à jour des programmes
            let programResult = null;
            if (programUpdates.length > 0) {
                console.log("=== PROGRAM UPDATES DEBUG ===");
                console.log("Total program updates to execute:", programUpdates.length);
                programUpdates.forEach((update, index) => {
                    console.log(`Update ${index + 1}:`, {
                        operation: Object.keys(update)[0],
                        filter: update.updateMany?.filter,
                        update: update.updateMany?.update
                    });
                });

                // Vérifier que les programmes existent
                for (const update of programUpdates) {
                    if (update.updateMany?.filter?._id?.$in) {
                        const programIds = update.updateMany.filter._id.$in;
                        const existingPrograms = await Program.find({ _id: { $in: programIds } }).session(session);
                        console.log(`Found ${existingPrograms.length}/${programIds.length} programs for update:`, 
                            existingPrograms.map(p => ({ id: p._id, name: p.name })));
                    }
                }

                programResult = await Program.bulkWrite(programUpdates, { session });
                console.log("✅ Bulk update result (Programs):", programResult);
            }

            console.log("✅ Client-Program synchronization completed successfully");
            return {
                clientResult,
                programResult,
                clientsProcessed: clients.length,
                programUpdatesProcessed: programUpdates.length
            };
        });

    } catch (error) {
        console.error("❌ Transaction failed, all changes rolled back:", error);
        throw error;
    } finally {
        await session.endSession();
    }
}

/**
 * Inserts or updates multiple programs in the database.
 * @param programs - Array of program objects to insert or update.
 */
 export async function updateOrInsertProgram(programs: Training[]) {
    const session = await mongoose.startSession();

    try {
        await connectDB();

        return await session.withTransaction(async () => {
            // 1. Préparer les opérations bulk pour les programmes
            const bulkOps = programs.map((program) => {
                const programId = program._id
                    ? new mongoose.Types.ObjectId(program._id)
                    : new mongoose.Types.ObjectId();

                return {
                    updateOne: {
                        filter: { _id: programId },
                        update: {
                            $set: {
                                name: program.name,
                                type: program.type,
                                coach: new mongoose.Types.ObjectId(program.coach),
                                durationWeeks: program.durationWeeks,
                                sessions: program.sessions,
                                clients: program.clients.map(clientId => new mongoose.Types.ObjectId(clientId)),
                                updatedAt: new Date(),
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                            }
                        },
                        upsert: true,
                    },
                };
            });

            // 2. PREMIÈRE ÉTAPE : Récupérer les anciens états AVANT la mise à jour
            const oldProgramStates = new Map();
            
            for (const program of programs) {
                if (program._id) {
                    const oldProgram = await Program.findById(new mongoose.Types.ObjectId(program._id))
                        .session(session);
                    if (oldProgram) {
                        oldProgramStates.set(program._id.toString(), oldProgram);
                        console.log(`📋 Saved old state for program ${program._id}:`, {
                            name: oldProgram.name,
                            clients: oldProgram.clients?.map(c => c.toString()) || []
                        });
                    }
                }
            }

            // 3. Exécuter les opérations sur les programmes
            let programResult = null;
            if (bulkOps.length > 0) {
                programResult = await Program.bulkWrite(bulkOps, { session });
                console.log("✅ Bulk update result (Programs):", programResult);
            }

            // 4. Mettre à jour les clients en utilisant les anciens états
            const clientUpdates = [];

            for (const program of programs) {
                // Récupérer le programme mis à jour
                const currentProgram = await Program.findOne(
                    program._id
                        ? { _id: new mongoose.Types.ObjectId(program._id) }
                        : { name: program.name, coach: program.coach }
                ).session(session);

                if (!currentProgram) continue;

                // Utiliser l'ancien état sauvegardé
                const oldProgram = program._id ? oldProgramStates.get(program._id.toString()) : null;
                console.log("Old program:", oldProgram);
                
                // ✅ CORRECTION : Convertir en strings pour la comparaison
                const oldClientIds: string[] = (oldProgram?.clients || []).map((id: any) => id.toString());
                const newClientIds: string[] = program.clients.map(id => id.toString());

                console.log("Old client IDs:", oldClientIds);
                console.log("New client IDs:", newClientIds);

                // Clients à retirer du programme (utiliser les IDs string)
                const clientIdsToRemove = oldClientIds.filter(
                    (oldId: string) => !newClientIds.includes(oldId)
                );

                // Clients à ajouter au programme (utiliser les IDs string)
                const clientIdsToAdd = newClientIds.filter(
                    (newId: string) => !oldClientIds.includes(newId)
                );

                console.log("Clients to remove:", clientIdsToRemove);
                console.log("Clients to add:", clientIdsToAdd);

                // ✅ CORRECTION : Convertir back en ObjectId pour les requêtes
                const clientsToRemove = clientIdsToRemove.map(id => new mongoose.Types.ObjectId(id));
                const clientsToAdd = clientIdsToAdd.map(id => new mongoose.Types.ObjectId(id));

                // ✅ CORRECTION : Utiliser l'ID du programme actuel (pas program._id qui peut être undefined)
                const actualProgramId = currentProgram._id;
                console.log("Using program ID for client updates:", actualProgramId);

                // Retirer le programme des anciens clients
                if (clientsToRemove.length > 0) {
                    console.log("Removing program from clients:", clientsToRemove.map(c => c.toString()));
                    clientUpdates.push({
                        updateMany: {
                            filter: { _id: { $in: clientsToRemove } },
                            update: {
                                $pull: { currentPrograms: actualProgramId }
                            }
                        }
                    });
                }

                // Ajouter le programme aux nouveaux clients
                if (clientsToAdd.length > 0) {
                    console.log("Adding program to clients:", clientsToAdd.map(c => c.toString()));
                    clientUpdates.push({
                        updateMany: {
                            filter: { _id: { $in: clientsToAdd } },
                            update: {
                                $addToSet: { currentPrograms: actualProgramId }
                            }
                        }
                    });
                }
            }

            // 5. Exécuter les mises à jour des clients
            let clientResult = null;
            if (clientUpdates.length > 0) {
                clientResult = await Client.bulkWrite(clientUpdates, { session });
                console.log("✅ Bulk update result (Clients):", clientResult);
            }

            console.log("✅ Transaction completed successfully");
            return {
                programResult,
                clientResult,
                programsProcessed: programs.length,
                clientUpdatesProcessed: clientUpdates.length
            };
        });

    } catch (error) {
        console.error("❌ Transaction failed, all changes rolled back:", error);
        throw error;
    } finally {
        await session.endSession();
    }
}