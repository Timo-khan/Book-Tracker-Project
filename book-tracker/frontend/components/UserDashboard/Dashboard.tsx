"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type User = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
};

type Book = {
	_id: string;
	title: string;
	author?: string;
	thumbnail_url?: string;
};

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const [favorites, setFavorites] = useState<Book[]>([]);
	const [toRead, setToRead] = useState<Book[]>([]);
	const [haveRead, setHaveRead] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);

	const apiUrl = "http://localhost:5002/api";

	useEffect(() => {
		async function fetchData() {
			try {
				// fetch user info
				const userRes = await fetch(`${apiUrl}/me`, { credentials: "include" });
				if (!userRes.ok) throw new Error("Not authenticated");
				const userData = await userRes.json();
				setUser(userData.user);

				// fetch books (plural + hyphenated routes)
				const [favRes, toReadRes, haveReadRes] = await Promise.all([
					fetch(`${apiUrl}/collections/favorites`, { credentials: "include" }),
					fetch(`${apiUrl}/collections/to-read`, { credentials: "include" }),
					fetch(`${apiUrl}/collections/have-read`, { credentials: "include" }),
				]);

				const [favData, toReadData, haveReadData] = await Promise.all([
					favRes.json(),
					toReadRes.json(),
					haveReadRes.json(),
				]);

				setFavorites(favData);
				setToRead(toReadData);
				setHaveRead(haveReadData);
			} catch (err) {
				console.error(err);
				window.location.href = "/";
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	async function handleLogout() {
		try {
			const res = await fetch(`${apiUrl}/logout`, {
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


	async function handleRemove(
		type: "favorites" | "to-read" | "have-read",
		id: string
	) {
		try {
			const res = await fetch(`${apiUrl}/collections/${type}/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to remove book");

			if (type === "favorites") {
				setFavorites(favorites.filter((b) => b._id !== id));
			} else if (type === "to-read") {
				setToRead(toRead.filter((b) => b._id !== id));
			} else if (type === "have-read") {
				setHaveRead(haveRead.filter((b) => b._id !== id));
			}
		} catch (err) {
			console.error(err);
			alert("Could not remove book.");
		}
	}

	if (loading) return <p>Loading dashboard...</p>;
	if (!user) return null;

	return (
		<div className="dashboard">
			<h1>
				Welcome {user.firstName} {user.lastName} 👋
			</h1>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<button onClick={handleLogout}>Logout</button>

			{/* Favorites */}
			<section>
				<h2>❤️ Favorites</h2>
				{favorites.length > 0 ? (
					<ul>
						{favorites.map((book) => (
							<li key={book._id}>
								{book.thumbnail_url && (
									<Image
										src={book.thumbnail_url}
										alt={book.title}
										width={80}
										height={120}
									/>
								)}
								{book.title} {book.author && `– ${book.author}`}
								<button
									onClick={() => handleRemove("favorites", book._id)}
									style={{ marginLeft: "10px" }}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No favorites yet.</p>
				)}
			</section>

			{/* To Read */}
			<section>
				<h2>📖 To Read</h2>
				{toRead.length > 0 ? (
					<ul>
						{toRead.map((book) => (
							<li key={book._id}>
								{book.thumbnail_url && (
									<Image
										src={book.thumbnail_url}
										alt={book.title}
										width={80}
										height={120}
									/>
								)}
								{book.title} {book.author && `– ${book.author}`}
								<button
									onClick={() => handleRemove("to-read", book._id)}
									style={{ marginLeft: "10px" }}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>Your To-Read list is empty.</p>
				)}
			</section>

			{/* Have Read */}
			<section>
				<h2>✅ Have Read</h2>
				{haveRead.length > 0 ? (
					<ul>
						{haveRead.map((book) => (
							<li key={book._id}>
								{book.thumbnail_url && (
									<Image
										src={book.thumbnail_url}
										alt={book.title}
										width={80}
										height={120}
									/>
								)}
								{book.title} {book.author && `– ${book.author}`}
								<button
									onClick={() => handleRemove("have-read", book._id)}
									style={{ marginLeft: "10px" }}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>You haven’t marked any books as read yet.</p>
				)}
			</section>
		</div>
	);
};

export default Dashboard;
