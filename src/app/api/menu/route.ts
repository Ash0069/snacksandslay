import { NextResponse } from "next/server";
import { getMenuCategories, getMenuItems } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    items: await getMenuItems(),
    categories: await getMenuCategories(),
  });
}
