import AuthProvider from "@/components/providers/AuthProvider";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
