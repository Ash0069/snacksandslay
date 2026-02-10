import crypto from "node:crypto";
import { createClient, type Client } from "@libsql/client";
import { DEFAULT_MENU_ITEMS, type MenuItem, type MenuItemInput } from "@/lib/menuData";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type DbRow = Record<string, unknown>;

declare global {
  var __snacksAndSlayDbClient: Client | undefined;
  var __snacksAndSlayDbInitPromise: Promise<void> | undefined;
}

function getDatabaseUrl(): string {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.LIBSQL_URL;

  if (!url) {
    throw new Error("Missing TURSO_DATABASE_URL (or LIBSQL_URL).");
  }

  return url;
}

function getDb(): Client {
  if (!globalThis.__snacksAndSlayDbClient) {
    globalThis.__snacksAndSlayDbClient = createClient({
      url: getDatabaseUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.LIBSQL_AUTH_TOKEN,
    });
  }

  return globalThis.__snacksAndSlayDbClient;
}

async function initializeDatabase(): Promise<void> {
  const db = getDb();

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        best_seller INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS menu_categories (
        name TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS admin_sessions (
        session_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`,
    ],
    "write",
  );

  const countResult = await db.execute("SELECT COUNT(*) as count FROM menu_items");
  const count = Number((countResult.rows[0] as DbRow | undefined)?.count ?? 0);

  if (count === 0) {
    const now = Date.now();
    await db.batch(
      DEFAULT_MENU_ITEMS.map((item) => ({
        sql: `INSERT INTO menu_items (id, name, price, category, description, best_seller, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          item.name,
          item.price,
          item.category,
          item.description,
          item.bestSeller ? 1 : 0,
          now,
        ],
      })),
      "write",
    );
  }

  const categoryRows = await db.execute("SELECT DISTINCT category FROM menu_items");
  const now = Date.now();
  const syncStatements = (categoryRows.rows as DbRow[])
    .map((row) => (typeof row.category === "string" ? row.category : ""))
    .filter(Boolean)
    .map((category) => ({
      sql: "INSERT OR IGNORE INTO menu_categories (name, created_at) VALUES (?, ?)",
      args: [category, now],
    }));

  if (syncStatements.length > 0) {
    await db.batch(syncStatements, "write");
  }
}

async function ensureDatabase(): Promise<Client> {
  if (!globalThis.__snacksAndSlayDbInitPromise) {
    globalThis.__snacksAndSlayDbInitPromise = initializeDatabase();
  }

  await globalThis.__snacksAndSlayDbInitPromise;
  return getDb();
}

function toMenuItem(row: DbRow): MenuItem {
  return {
    id: String(row.id),
    name: String(row.name),
    price: String(row.price),
    category: String(row.category),
    description: String(row.description),
    bestSeller: Number(row.best_seller) === 1,
  };
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const db = await ensureDatabase();
  const result = await db.execute(
    "SELECT id, name, price, category, description, best_seller FROM menu_items ORDER BY created_at DESC, id DESC",
  );

  return (result.rows as DbRow[]).map(toMenuItem);
}

export async function getMenuCategories(): Promise<string[]> {
  const db = await ensureDatabase();
  const result = await db.execute("SELECT name FROM menu_categories ORDER BY name ASC");

  return (result.rows as DbRow[]).map((row) => String(row.name));
}

export async function categoryExists(category: string): Promise<boolean> {
  const db = await ensureDatabase();
  const result = await db.execute({
    sql: "SELECT name FROM menu_categories WHERE name = ?",
    args: [category],
  });

  return result.rows.length > 0;
}

export async function createMenuCategory(name: string): Promise<{ created: boolean; name: string }> {
  const db = await ensureDatabase();
  const result = await db.execute({
    sql: "INSERT OR IGNORE INTO menu_categories (name, created_at) VALUES (?, ?)",
    args: [name, Date.now()],
  });

  return { created: result.rowsAffected > 0, name };
}

export async function deleteMenuCategory(
  name: string,
): Promise<{ deleted: boolean; reason?: "CATEGORY_NOT_FOUND" | "CATEGORY_HAS_ITEMS" }> {
  const db = await ensureDatabase();
  const countResult = await db.execute({
    sql: "SELECT COUNT(*) as count FROM menu_items WHERE category = ?",
    args: [name],
  });
  const count = Number((countResult.rows[0] as DbRow | undefined)?.count ?? 0);

  if (count > 0) {
    return { deleted: false, reason: "CATEGORY_HAS_ITEMS" };
  }

  const deleteResult = await db.execute({
    sql: "DELETE FROM menu_categories WHERE name = ?",
    args: [name],
  });

  if (deleteResult.rowsAffected === 0) {
    return { deleted: false, reason: "CATEGORY_NOT_FOUND" };
  }

  return { deleted: true };
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const db = await ensureDatabase();
  const id = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO menu_items (id, name, price, category, description, best_seller, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.name,
      input.price,
      input.category,
      input.description,
      input.bestSeller ? 1 : 0,
      Date.now(),
    ],
  });

  return { id, ...input };
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItem | null> {
  const db = await ensureDatabase();
  const result = await db.execute({
    sql: `UPDATE menu_items
          SET name = ?, price = ?, category = ?, description = ?, best_seller = ?
          WHERE id = ?`,
    args: [
      input.name,
      input.price,
      input.category,
      input.description,
      input.bestSeller ? 1 : 0,
      id,
    ],
  });

  if (result.rowsAffected === 0) {
    return null;
  }

  return { id, ...input };
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const db = await ensureDatabase();
  const result = await db.execute({
    sql: "DELETE FROM menu_items WHERE id = ?",
    args: [id],
  });

  return result.rowsAffected > 0;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  return username === expectedUsername && password === expectedPassword;
}

export async function createAdminSession(): Promise<string> {
  const db = await ensureDatabase();
  const sessionId = crypto.randomUUID();
  const now = Date.now();

  await db.execute({
    sql: "INSERT INTO admin_sessions (session_id, created_at, expires_at) VALUES (?, ?, ?)",
    args: [sessionId, now, now + SESSION_TTL_MS],
  });

  return sessionId;
}

export async function isAdminSessionValid(sessionId: string): Promise<boolean> {
  const db = await ensureDatabase();
  const result = await db.execute({
    sql: "SELECT expires_at FROM admin_sessions WHERE session_id = ?",
    args: [sessionId],
  });
  const row = result.rows[0] as DbRow | undefined;

  if (!row) {
    return false;
  }

  if (Number(row.expires_at) < Date.now()) {
    await db.execute({
      sql: "DELETE FROM admin_sessions WHERE session_id = ?",
      args: [sessionId],
    });
    return false;
  }

  return true;
}

export async function deleteAdminSession(sessionId: string): Promise<void> {
  const db = await ensureDatabase();
  await db.execute({
    sql: "DELETE FROM admin_sessions WHERE session_id = ?",
    args: [sessionId],
  });
}
