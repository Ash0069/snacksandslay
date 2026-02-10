import { NextResponse } from "next/server";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminSession";
import { categoryExists, createMenuItem, getMenuCategories, getMenuItems } from "@/lib/db";
import type { MenuItemInput } from "@/lib/menuData";

type MenuBody = {
  name?: unknown;
  price?: unknown;
  category?: unknown;
  description?: unknown;
  bestSeller?: unknown;
};

function parseMenuInput(value: MenuBody): MenuItemInput | null {
  if (
    typeof value.name !== "string" ||
    typeof value.price !== "string" ||
    typeof value.category !== "string" ||
    typeof value.description !== "string" ||
    typeof value.bestSeller !== "boolean"
  ) {
    return null;
  }

  const name = value.name.trim();
  const price = value.price.trim();
  const category = value.category.trim();
  const description = value.description.trim();

  if (!name || !price || !category || !description) {
    return null;
  }

  return {
    name,
    price,
    category,
    description,
    bestSeller: value.bestSeller,
  };
}

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

  return NextResponse.json({
    items: await getMenuItems(),
    categories: await getMenuCategories(),
  });
}

export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: MenuBody;

  try {
    body = (await request.json()) as MenuBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = parseMenuInput(body);

  if (!input) {
    return NextResponse.json({ error: "Invalid menu item input." }, { status: 400 });
  }

  if (!(await categoryExists(input.category))) {
    return NextResponse.json({ error: "Category does not exist." }, { status: 400 });
  }

  const item = await createMenuItem(input);
  return NextResponse.json({ item }, { status: 201 });
}
