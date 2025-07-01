import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const data = await prisma.attachments.findMany({})

    return NextResponse.json({ data }, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}