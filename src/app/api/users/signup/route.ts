import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type ErrorResponse = {
  message: string;
};
connect();
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Check if user exists
    const checkUserExist = await User.findOne({email});
    console.log(checkUserExist);
    if (checkUserExist) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    // Hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log("saved: ", savedUser);
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: savedUser,
    });
  } catch (error: unknown) {
    const { message } = error as ErrorResponse;
    return NextResponse.json({ error: message });
  }
}
