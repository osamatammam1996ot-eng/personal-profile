import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

const BUCKET = "make-f7b587fc-cms";
const CMS_KEY = "cms:portfolio:v1";

// Get environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://lajgxkcqnqmgzofshqdg.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "sb_secret_Mduz02x72HYd96_taiK2ww_1YlIiZib";

console.log("[Server] SUPABASE_URL:", SUPABASE_URL);
console.log("[Server] SUPABASE_SERVICE_ROLE_KEY exists:", !!SUPABASE_SERVICE_ROLE_KEY);

// Supabase admin client for storage operations
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

// Initialize public storage bucket for CMS images
(async () => {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
        fileSizeLimit: 10485760, // 10MB
      });
      if (error) console.log("Bucket creation error:", error.message);
      else console.log("CMS storage bucket created:", BUCKET);
    } else {
      console.log("CMS storage bucket already exists:", BUCKET);
    }
  } catch (e) {
    console.log("Storage init error:", e);
  }
})();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
const healthHandler = (c: any) => {
  return c.json({ status: "ok" });
};

app.get("/health", healthHandler);
app.get("/make-server-f7b587fc/health", healthHandler);

// ─── GET CMS Data ─────────────────────────────────────────────────────────────
const getCmsDataHandler = async (c: any) => {
  try {
    const data = await kv.get(CMS_KEY);
    return c.json({ data: data ?? null });
  } catch (e) {
    console.log("CMS GET error:", e);
    return c.json({ error: `Failed to retrieve CMS data: ${e}` }, 500);
  }
};

app.get("/cms/data", getCmsDataHandler);
app.get("/make-server-f7b587fc/cms/data", getCmsDataHandler);

// ─── PUT CMS Data ─────────────────────────────────────────────────────────────
const putCmsDataHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    body.updatedAt = new Date().toISOString();
    await kv.set(CMS_KEY, body);
    return c.json({ success: true, updatedAt: body.updatedAt });
  } catch (e) {
    console.log("CMS PUT error:", e);
    return c.json({ error: `Failed to save CMS data: ${e}` }, 500);
  }
};

app.put("/cms/data", putCmsDataHandler);
app.put("/make-server-f7b587fc/cms/data", putCmsDataHandler);

// ─── POST Upload Image ────────────────────────────────────────────────────────
const uploadCmsImageHandler = async (c: any) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided in form data" }, 400);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const buf = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(safeName, buf, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.log("Upload error:", uploadError.message);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(safeName);

    return c.json({ url: publicUrl, filename: safeName });
  } catch (e) {
    console.log("Image upload error:", e);
    return c.json({ error: `Image upload failed: ${e}` }, 500);
  }
};

app.post("/cms/upload", uploadCmsImageHandler);
app.post("/make-server-f7b587fc/cms/upload", uploadCmsImageHandler);

// ─── DELETE Image ─────────────────────────────────────────────────────────────
const deleteCmsImageHandler = async (c: any) => {
  try {
    const filename = c.req.param("filename");
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([filename]);
    if (error) {
      return c.json({ error: `Delete failed: ${error.message}` }, 500);
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `Delete failed: ${e}` }, 500);
  }
};

app.delete("/cms/upload/:filename", deleteCmsImageHandler);
app.delete("/make-server-f7b587fc/cms/upload/:filename", deleteCmsImageHandler);

Deno.serve(app.fetch);
