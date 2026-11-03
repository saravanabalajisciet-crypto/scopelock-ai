import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Workspace — ScopeLock AI",
  description: "Validate agreements and invoices with AI before authorizing payments.",
};
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
