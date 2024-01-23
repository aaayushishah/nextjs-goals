import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
type ErrorResponse = {
  message: string;
};
connect();
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {  email, password } = body;

    // Check if user exists
    const checkUserExist = await User.findOne({email});
    console.log(checkUserExist);
    if (!checkUserExist) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }
    // Hashpassword
    const validPassword = await bcryptjs.compare(password, checkUserExist.password);
     if (!validPassword) {
      return NextResponse.json(
        { error: "Password not valid" },
        { status: 400 }
      );
    }

    // create token data
    const tokenData ={
        id:checkUserExist._id,
        username:checkUserExist.username,
        email:checkUserExist.email
    }
    
    // create token from json web token

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d'})
    console.log("token: ", token)

    const response = NextResponse.json({
        message: "Login Successfull",
        success:true,
    })
    response.cookies.set('token', token, {
        httpOnly:true
    })
    return response
  } catch (error: unknown) {
    const { message } = error as ErrorResponse;
    return NextResponse.json({ error: message }, {status:500});
  }
}
