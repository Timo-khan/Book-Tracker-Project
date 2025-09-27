"use client";

import Header from "@/frontend/components/header/Header";
import { useSession } from "../components/auth/SessionProvider";

export default function HeaderWithSession() {
	const { user, handleLogout, loading } = useSession();

	if (loading) return <p>Loading...</p>;
	return <Header user={user || undefined} onLogout={handleLogout} />;
}
