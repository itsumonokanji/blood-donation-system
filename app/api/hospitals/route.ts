import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const hospitals = await sql`SELECT * FROM hospitals ORDER BY id DESC`;
    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sql`
      INSERT INTO hospitals (name, location, contact)
      VALUES (${body.name}, ${body.location}, ${body.contact})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM hospitals WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// Добавь это в app/api/hospitals/route.ts

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await sql`
      UPDATE hospitals
      SET name = ${body.name},
          location = ${body.location},
          contact = ${body.contact}
      WHERE id = ${body.id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}