import AuthProvider from "@/components/providers/AuthProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin - Paragonpass",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[var(--brand-cream)]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
