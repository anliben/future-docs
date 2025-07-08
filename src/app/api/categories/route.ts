import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const customer = searchParams.get('customer')

  if (!customer) return NextResponse.json({ error: 'Precisa passar a empresa responsável' }, { status: 404 })

  try {
    const data = await prisma.categories.findMany({
      where: { customer: { contains: customer, mode: 'insensitive' } },
    })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}