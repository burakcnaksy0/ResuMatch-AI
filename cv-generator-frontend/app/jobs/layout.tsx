import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
