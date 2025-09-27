"use client";

import Header from "@/frontend/components/header/Header";
// Importing the custom hook that gives access to user session state (user, loading, handleLogout)
import { useSession } from "../auth/SessionProvider";

// passing user and handleLogout props to header
export default function HeaderWithSession() {
	const { user, handleLogout, loading } = useSession();

	if (loading) return <p>Loading...</p>;
	return <Header user={user || undefined} onLogout={handleLogout} />;
}
