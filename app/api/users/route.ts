import { prisma } from 'server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received request body:", body); // Add this line for logging

    const newUser = await prisma.user.create({
      data: body
    })

    console.log("New user created:", newUser); // Add this line for logging
    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error:", error); // Add this line for logging
    return NextResponse.json('Internal Server Error', {
      status: 500
    })
  }
}

export async function GET(request: Request) {
  try {
    // Fetch all users from Prisma
    const users = await prisma.user.findMany();
    // console.log("Users:", users); // Add this line for logging

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error:", error); // Add this line for logging
    return NextResponse.json('Internal Server Error', {
      status: 500
    })
  }
}
