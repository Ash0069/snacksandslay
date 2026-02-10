import { NextResponse } from "next/server";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminSession";
import { deleteMenuCategory } from "@/lib/db";

type RouteContext = {
  params: Promise<{ name: string }>;
};

async function ensureAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    await clearAdminSession();
  }

  return authenticated;
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { name } = await context.params;
  const decodedName = decodeURIComponent(name).trim();

  if (!decodedName) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const result = await deleteMenuCategory(decodedName);

  if (!result.deleted && result.reason === "CATEGORY_HAS_ITEMS") {
    return NextResponse.json(
      { error: "Cannot delete a category that still has items." },
      { status: 409 },
    );
  }

  if (!result.deleted) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
