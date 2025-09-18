"use client";

import React, { useEffect, useState } from "react";

type User = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
};

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("http://localhost:5002/api/me", {
					credentials: "include", // send cookie
				});
				if (!res.ok) throw new Error("Not authenticated");
				const data = await res.json();
				setUser(data.user);
			} catch (err) {
                console.error(err);
				// if not logged in, send them back to login page
				window.location.href = "/";
			}
		}
		fetchUser();
	}, []);

	async function handleLogout() {
		try {
			const res = await fetch("http://localhost:5002/api/logout", {
				method: "POST",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Logout failed");
			window.location.href = "/";
		} catch (err) {
			console.error(err);
			alert("Something went wrong while logging out");
		}
	}

	if (!user) return <p>Loading dashboard...</p>;

	return (
		<div className="dashboard">
			<h1>
				Welcome {user.firstName} {user.lastName} 👋
			</h1>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
};

export default Dashboard;
