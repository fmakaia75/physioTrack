import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";
import Client from "@/models/Client"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // const coachEmail = searchParams.get("test-2@example.com"); // Email used for authentication

    // if (!coachEmail) {
    //   return NextResponse.json({ success: false, error: "No coach email provided" });
    // }

    // Fetch coach info
    const coach = await User.findOne({ email: "test-2@example.com" });

    if (!coach) {
      return NextResponse.json({ success: false, error: "Coach not found" });
    }

    // Fetch trainees assigned to this coach
    const trainees = await Client.find({ coach: coach._id });
    console.log(trainees)
    // Fetch programs managed by this coach
    const programs = await Program.find({ coach: coach._id });
    
    return NextResponse.json({
      success: true,
      coachInfo: coach,
      trainees: trainees,
      programs: programs,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
