import { notFound } from "next/navigation";
import EbookForm from "@/components/admin/EbookForm";
import { getEbookById } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function EditEbook({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ebook = await getEbookById(id);
  if (!ebook) notFound();
  return <EbookForm initial={ebook} />;
}
