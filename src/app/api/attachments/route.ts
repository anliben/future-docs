import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const customer = searchParams.get('customer')
  const category = searchParams.get('category')

  if (!customer) return NextResponse.json({ error: 'Precisa passar a empresa responsável' }, { status: 404 })
  if (!category) return NextResponse.json({ error: 'Precisa passar a category' }, { status: 404 })

  try {
    const data = await prisma.attachments.findMany({
      where: {
        customer: { contains: customer, mode: 'insensitive' },
        type: { contains: category, mode: 'insensitive' },
      },
    })

    let category_db = await prisma.categories.findFirst({
      where: {
        label: category
      }
    })

    await prisma.categories.update({
      where: {
        id: category_db.id
      },
      data: {
        unreaded: 0
      }
    })

    return NextResponse.json({ data }, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}