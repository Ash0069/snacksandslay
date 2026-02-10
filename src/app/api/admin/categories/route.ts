import { NextResponse } from "next/server";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminSession";
import { createMenuCategory, getMenuCategories } from "@/lib/db";

type CategoryBody = {
  name?: unknown;
};

async function ensureAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    await clearAdminSession();
  }

  return authenticated;
}

export async function GET() {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ categories: await getMenuCategories() });
}

export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: CategoryBody;

  try {
    body = (await request.json()) as CategoryBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const result = await createMenuCategory(name);

  if (!result.created) {
    return NextResponse.json({ error: "Category already exists." }, { status: 409 });
  }

  return NextResponse.json({ category: result.name }, { status: 201 });
}
