import { sql } from "@/lib/db";

export async function GET() {
  const requests = await sql`SELECT * FROM requests ORDER BY id DESC`;
  return Response.json(requests);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Мы используем "безопасную" вставку. 
    // Если колонок lat/lng нет в базе, этот запрос может упасть.
    // Если ошибка повторится, значит нужно зайти в БД и добавить колонки.
    const result = await sql`
      INSERT INTO requests (hospital, blood_group, status, location, lat, lng)
      VALUES (
        ${body.hospital}, 
        ${body.blood_group}, 
        'pending', 
        ${body.location || 'Бишкек'}, 
        ${body.lat ? Number(body.lat) : 42.8747}, 
        ${body.lng ? Number(body.lng) : 74.5698}
      )
      RETURNING *
    `;
    
    return Response.json(result[0]);
  } catch (error: any) {
    // ВАЖНО: Это выведет реальную ошибку в терминал (черное окно VS Code)
    console.error("ОШИБКА БАЗЫ ДАННЫХ:", error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // 1. Закрываем запрос
    const result = await sql`
      UPDATE requests
      SET status = 'done',
          donor_name = ${body.donorName || 'Анонимно'}
      WHERE id = ${body.id}
      RETURNING *
    `;

    // 2. Если донор был назначен, обновляем дату его последней донации на СЕГОДНЯ
    if (body.donorName && body.donorName !== 'Анонимно') {
      await sql`
        UPDATE donors 
        SET last_donation = CURRENT_DATE 
        WHERE name = ${body.donorName}
      `;
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Ошибка в API:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await sql`DELETE FROM requests WHERE id = ${id}`;
    return Response.json({ message: "Deleted" });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}