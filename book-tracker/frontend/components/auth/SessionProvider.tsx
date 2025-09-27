"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/frontend/services/bookServices";

interface User {
	username: string;
	image?: string;
}

interface SessionContextType {
	user: User | null; //user log status
	loading: boolean; // if session state is still being fetched
	handleLogout: () => Promise<void>;
}

// React Context to share user session state across the whole app
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export default function SessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null); // store user data
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	//fetching the logged-in user from backend
	useEffect(() => {
		getUser()
			.then((data) => setUser(data))
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	async function handleLogout() {
		await fetch("http://localhost:5002/api/logout", {
			method: "POST",
			credentials: "include", // send cookies (JWT token)
		});
		setUser(null); // clear user state
		router.push("/");
	}

	return (
		<SessionContext.Provider value={{ user, loading, handleLogout }}>
			{children}
		</SessionContext.Provider>
	);
}

// Custom hook for consuming session anywhere
export function useSession() {
	const context = useContext(SessionContext);
	if (!context) {
		// Safety check → prevents using useSession outside of <SessionProvider>
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context; // gives { user, loading, handleLogout }
}
