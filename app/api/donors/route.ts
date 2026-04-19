import { sql } from "@/lib/db";

export async function GET() {
  const donors = await sql`
    SELECT * FROM donors
    ORDER BY id DESC
  `;
  return Response.json(donors);
}

export async function POST(req: Request) {
  const body = await req.json();

  const result = await sql`
    INSERT INTO donors (name, blood_group, location)  -- ✅ ДОБАВИЛ
    VALUES (${body.name}, ${body.blood_group}, ${body.location})  -- ✅ ДОБАВИЛ
    RETURNING *
  `;

  return Response.json(result[0]);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await sql`
    DELETE FROM donors
    WHERE id = ${id}
  `;

  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  const result = await sql`
    UPDATE donors
    SET name = ${body.name},
        blood_group = ${body.blood_group},
        location = ${body.location}  -- ✅ ДОБАВИЛ
    WHERE id = ${body.id}
    RETURNING *
  `;

  return Response.json(result[0]);
}