import { sql } from "@/lib/db";

export async function GET() {
  const requests = await sql`SELECT * FROM requests ORDER BY id DESC`;
  return Response.json(requests);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await sql`
    INSERT INTO requests (hospital, blood_group, status)
    VALUES (${body.hospital}, ${body.blood_group}, 'pending')
    RETURNING *
  `;
  return Response.json(result[0]);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const result = await sql`
    UPDATE requests
    SET status = 'done'
    WHERE id = ${body.id}
    RETURNING *
  `;
  return Response.json(result[0]);
}