import { sql } from "@/lib/db";

export async function GET() {
  const donors = await sql`
    SELECT * FROM donors
    ORDER BY id DESC
  `;
  return Response.json(donors);
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sql`
      INSERT INTO donors (name, blood_group, location, contact, lat, lng)
      VALUES (${body.name}, ${body.blood_group}, ${body.location}, ${body.contact}, ${body.lat || null}, ${body.lng || null})
      RETURNING *
    `;
    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create donor" }, { status: 500 });
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
    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
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
