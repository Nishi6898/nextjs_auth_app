import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
//import { sendEmail } from "@/helpers/mailer";


connect()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        console.log("reqBody"+reqBody);

        //check if user already exists
        const user = await User.findOne({email})

        console.log("Beforee check user")

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        console.log("Beforee hash password ")

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        console.log("Before new user ")

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log("SavedUser"+savedUser);
        // send confirmation is all about we need. 
        //send verification email

        //await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success: true, 
            savedUser
        })
    } catch (error: any) {
        console.log("Before returning error ")
        return NextResponse.json({error: error.message}, {status: 500})

    }
}