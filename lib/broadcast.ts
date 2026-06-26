import { createSupabaseServer } from "./supabase-server";
import { resend, hasResend, NEWSLETTER_FROM, broadcastEmail } from "./resend";

/** Send a "new article" broadcast to all active subscribers (Resend batch API). */
export async function broadcastArticle(article: {
  title: string; slug: string; excerpt?: string | null;
}): Promise<{ sent: number }> {
  if (!hasResend || !resend) return { sent: 0 };
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("subscribers")
    .select("email, name, unsubscribe_token")
    .eq("status", "active");

  const subs = (data ?? []) as { email: string; name: string | null; unsubscribe_token: string }[];
  if (subs.length === 0) return { sent: 0 };

  // Resend batch send: max 100 per call
  for (let i = 0; i < subs.length; i += 100) {
    const chunk = subs.slice(i, i + 100).map((s) => ({
      from: NEWSLETTER_FROM,
      to: s.email,
      subject: `Artikel Baru: ${article.title}`,
      html: broadcastEmail(article, s.unsubscribe_token),
    }));
    await resend.batch.send(chunk).catch(() => {});
  }
  return { sent: subs.length };
}
