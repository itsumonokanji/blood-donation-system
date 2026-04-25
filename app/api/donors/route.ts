import { sql } from "@/lib/db";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const donors = await sql`
      SELECT * FROM donors
      ORDER BY id DESC
    `;
    return NextResponse.json(donors);
  } catch (error) {
    console.error("Database error:", error);
    // Возвращаем пустой массив, чтобы фронтенд не сломался при ошибке базы
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sql`
      INSERT INTO donors (name, blood_group, location, contact, lat, lng)
      VALUES (${body.name}, ${body.blood_group}, ${body.location}, ${body.contact}, ${body.lat || null}, ${body.lng || null})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create donor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await sql`
      UPDATE donors
      SET name = ${body.name},
          blood_group = ${body.blood_group},
          location = ${body.location},
          contact = ${body.contact},
          lat = ${body.lat || null},
          lng = ${body.lng || null}
      WHERE id = ${body.id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await sql`
      DELETE FROM donors
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}