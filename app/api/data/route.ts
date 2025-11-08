import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "contacts.json")

function readData() {
  const fileContents = fs.readFileSync(dataFilePath, "utf8")
  return JSON.parse(fileContents)
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

export async function GET() {
  try {
    const data = readData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, ...entity } = body

    const data = readData()
    const collection = `${type}s` as keyof typeof data

    if (!data[collection] || !Array.isArray(data[collection])) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 })
    }

    // Generate ID
    const maxId = Math.max(
      ...(data[collection] as any[]).map((item: any) => parseInt(item.id) || 0),
      0,
    )
    const newId = (maxId + 1).toString()

    // Add default values
    const newEntity = {
      ...entity,
      id: newId,
      ownerId: entity.ownerId || "mohammed-ahmadi",
    }

    // Add type-specific defaults
    if (type === "contact") {
      newEntity.avatar = newEntity.avatar || "/placeholder.svg?height=80&width=80"
      newEntity.lastActivity = newEntity.lastActivity || "No activity yet"
    }

    if (type === "company") {
      newEntity.isPrimary = newEntity.isPrimary || false
    }

    if (type === "deal") {
      newEntity.priority = newEntity.priority || "medium"
    }

    if (type === "ticket") {
      newEntity.status = newEntity.status || "New"
      newEntity.priority = newEntity.priority || "Medium"
      newEntity.assigneeId = newEntity.assigneeId || "mohammed-ahmadi"
      const now = new Date().toISOString()
      newEntity.createdAt = newEntity.createdAt || now
      newEntity.updatedAt = newEntity.updatedAt || now
    }

    ;(data[collection] as any[]).push(newEntity)
    writeData(data)

    return NextResponse.json(newEntity, { status: 201 })
  } catch (error) {
    console.error("Error creating entity:", error)
    return NextResponse.json({ error: "Failed to create entity" }, { status: 500 })
  }
}

