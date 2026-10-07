import { redirect } from "next/navigation";

/**
 * Legacy launch path kept as a permanent redirect so existing game windows and
 * bookmarks land on the Vexynix play screen (prototype-5 in-place swap).
 */
export default async function MockGameRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") qs.set(key, value);
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  redirect(`/play/${encodeURIComponent(id)}${suffix}`);
}
