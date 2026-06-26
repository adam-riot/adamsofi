import { listInquiries } from "@/lib/admin";
import InquiryTable from "@/components/admin/InquiryTable";

export const dynamic = "force-dynamic";

export default async function AdminInquiries() {
  const inquiries = await listInquiries();
  return (
    <div>
      <h1 className="admin-h1">Inquiries</h1>
      <div className="admin-panel">
        <InquiryTable inquiries={inquiries} />
      </div>
    </div>
  );
}
