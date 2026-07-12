import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/session";

// Private store ("ebook-files") — custom token, not the default BLOB_READ_WRITE_TOKEN.
const FILES_TOKEN = process.env.EBOOK_FILES_BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!FILES_TOKEN) return NextResponse.json({ error: "Storage belum dikonfigurasi." }, { status: 503 });

  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: FILES_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("ebook-files/")) throw new Error("Invalid path.");
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("ebook file upload completed", blob.pathname);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
