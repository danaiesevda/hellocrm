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

// Helper function to get the correct collection name
function getCollectionName(type: string): string {
  const collectionMap: Record<string, string> = {
    company: "companies",
    contact: "contacts",
    deal: "deals",
    ticket: "tickets",
  }
  return collectionMap[type] || `${type}s`
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

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 })
    }

    const data = readData()
    const collection = getCollectionName(type) as keyof typeof data

    if (!data[collection] || !Array.isArray(data[collection])) {
      // Initialize empty array if collection doesn't exist
      if (!data[collection]) {
        data[collection] = []
      } else {
        return NextResponse.json({ error: `Invalid collection: ${String(collection)}` }, { status: 400 })
      }
    }

    // Generate ID - use provided ID if available (for companies), otherwise generate numeric ID
    let newId = entity.id
    if (!newId) {
      // For companies, IDs are strings, so we generate numeric IDs for other types
      if (type === "company") {
        // Companies should have IDs provided from the name
        if (!entity.name || !entity.name.trim()) {
          return NextResponse.json({ error: "Company name is required" }, { status: 400 })
        }
        const baseId = entity.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "company-1"
        // Check if ID already exists, append number if needed
        let counter = 1
        newId = baseId
        while ((data[collection] as any[]).some((item: any) => item.id === newId)) {
          newId = `${baseId}-${counter}`
          counter++
        }
      } else {
        // For other types, generate numeric IDs
        const maxId = Math.max(
          ...(data[collection] as any[]).map((item: any) => {
            const parsed = parseInt(item.id)
            return isNaN(parsed) ? 0 : parsed
          }),
          0,
        )
        newId = (maxId + 1).toString()
      }
    } else {
      // If ID is provided, check for duplicates (for companies)
      if (type === "company" && (data[collection] as any[]).some((item: any) => item.id === newId)) {
        return NextResponse.json({ error: "Company with this ID already exists" }, { status: 400 })
      }
    }

    // Add default values
    const newEntity = {
      ...entity,
      id: newId,
      ownerId: entity.ownerId || "sevda-danaie",
    }

    // Add type-specific defaults
    if (type === "contact") {
      // Generate avatar URL using UI Avatars service
      const firstName = entity.firstName || ""
      const lastName = entity.lastName || ""
      const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U"
      newEntity.avatar = newEntity.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=87CEEB&color=fff&size=128&bold=true`
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
      newEntity.assigneeId = newEntity.assigneeId || "sevda-danaie"
      const now = new Date().toISOString()
      newEntity.createdAt = newEntity.createdAt || now
      newEntity.updatedAt = newEntity.updatedAt || now
    }

    try {
      ;(data[collection] as any[]).push(newEntity)
      writeData(data)
    } catch (writeError: any) {
      console.error("Error writing data:", writeError)
      return NextResponse.json({ error: `Failed to save ${type}: ${writeError?.message || "Unknown error"}` }, { status: 500 })
    }

    return NextResponse.json(newEntity, { status: 201 })
  } catch (error: any) {
    console.error("Error creating entity:", error)
    const errorMessage = error?.message || "Failed to create entity"
    return NextResponse.json({ error: errorMessage, details: error?.stack }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { type, id, ...updates } = body

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required" }, { status: 400 })
    }

    const data = readData()
    const collection = getCollectionName(type) as keyof typeof data

    if (!data[collection] || !Array.isArray(data[collection])) {
      return NextResponse.json({ error: `Collection ${String(collection)} not found` }, { status: 404 })
    }

    const index = (data[collection] as any[]).findIndex((item: any) => item.id === id)
    if (index === -1) {
      return NextResponse.json({ error: `${type} with ID ${id} not found` }, { status: 404 })
    }

    // Update the entity while preserving the ID and other important fields
    const existingEntity = (data[collection] as any[])[index]
    const updatedEntity = {
      ...existingEntity,
      ...updates,
      id: existingEntity.id, // Preserve the ID
      updatedAt: new Date().toISOString(), // Update timestamp
    }

    // Update avatar for contacts if name changed
    if (type === "contact" && (updates.firstName || updates.lastName)) {
      const firstName = updates.firstName || existingEntity.firstName || ""
      const lastName = updates.lastName || existingEntity.lastName || ""
      updatedEntity.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=87CEEB&color=fff&size=128&bold=true`
    }

    // Update updatedAt for tickets
    if (type === "ticket") {
      updatedEntity.updatedAt = new Date().toISOString()
    }

    ;(data[collection] as any[])[index] = updatedEntity
    writeData(data)

    return NextResponse.json(updatedEntity)
  } catch (error: any) {
    console.error("Error updating entity:", error)
    const errorMessage = error?.message || "Failed to update entity"
    return NextResponse.json({ error: errorMessage, details: error?.stack }, { status: 500 })
  }
}

