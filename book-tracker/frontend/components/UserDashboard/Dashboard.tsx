"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
	transferCurrentRead,
	getUser,
	getFavorites,
	getToRead,
	getHaveRead,
	getCurrentReads,
} from "@/frontend/services/bookServices";
import "./Dashboard.css";

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
	webReaderLink?: string;
};

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const [favorites, setFavorites] = useState<Book[]>([]);
	const [toRead, setToRead] = useState<Book[]>([]);
	const [haveRead, setHaveRead] = useState<Book[]>([]);
	const [currentReads, setCurrentReads] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);

	const [openSection, setOpenSection] = useState<
		"favorites" | "to-read" | "have-read" | "currentReads" | null
	>(null);

	const apiUrl = "http://localhost:5002/api";

	useEffect(() => {
		async function fetchData() {
			try {
				const [user, favorites, toRead, haveRead, currentReads] =
					await Promise.all([
						getUser(),
						getFavorites(),
						getToRead(),
						getHaveRead(),
						getCurrentReads(),
					]);

				setUser(user);
				setFavorites(favorites);
				setToRead(toRead);
				setHaveRead(haveRead);
				setCurrentReads(currentReads);
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
		type: "favorites" | "to-read" | "have-read" | "current-reads",
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
			if (type === "current-reads") {
				setCurrentReads(currentReads.filter((b) => b._id !== id));
			}
		} catch (err) {
			console.error(err);
			alert("Could not remove book.");
		}
	}

	async function handleTransfer(id: string) {
		try {
			const data = await transferCurrentRead(id);
			// Remove from Current Reads, add to Have Read
			setCurrentReads((prev) => prev.filter((b) => b._id !== id));
			setHaveRead((prev) => [...prev, data.book]);
		} catch (err) {
			console.error(err);
			alert("Could not transfer book.");
		}
	}

	if (loading) return <p>Loading dashboard...</p>;
	if (!user) return null;

	return (
		<div className="dashboard">
			<h1>
				Welcome {user.firstName} {user.lastName}!
			</h1>
			<p>Username: {user.username}</p>
			<button onClick={handleLogout}>Logout</button>

			{/* Current Reads */}
			<section className="dropdown">
				<h2
					onClick={() =>
						setOpenSection(
							openSection === "currentReads" ? null : "currentReads"
						)
					}
				>
					📚 Current Reads
				</h2>

				{openSection === "currentReads" && (
					<ul>
						{currentReads.length > 0 ? (
							currentReads.map((book) => (
								<li key={book._id}>
									{book.thumbnail_url && (
										<Image
											src={book.thumbnail_url}
											alt={book.title}
											width={80}
											height={120}
										/>
									)}
									{book.title}

									<div className="book-actions">
										{book.webReaderLink && (
											<a
												href={book.webReaderLink}
												target="_blank"
												rel="noopener noreferrer"
												className="read-online-btn"
											>
												Read Online
											</a>
										)}
										<button onClick={() => handleTransfer(book._id)}>
											Mark as Finished
										</button>
										<button
											onClick={() => handleRemove("current-reads", book._id)}
										>
											Remove
										</button>
									</div>
								</li>
							))
						) : (
							<p>No Current Reads yet.</p>
						)}
					</ul>
				)}
			</section>

			{/* Favorites */}
			<section className="dropdown">
				<h2
					onClick={() =>
						setOpenSection(openSection === "favorites" ? null : "favorites")
					}
				>
					⭐ Favorites
				</h2>
				{openSection === "favorites" && (
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
								{book.title}
								<button onClick={() => handleRemove("favorites", book._id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			{/* To Read */}
			<section className="dropdown">
				<h2
					onClick={() =>
						setOpenSection(openSection === "to-read" ? null : "to-read")
					}
				>
					📖 To Read
				</h2>
				{openSection === "to-read" && (
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
								{book.title}
								<button onClick={() => handleRemove("to-read", book._id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Have Read */}
			<section className="dropdown">
				<h2
					onClick={() =>
						setOpenSection(openSection === "have-read" ? null : "have-read")
					}
				>
					✅ Have Read
				</h2>
				{openSection === "have-read" && (
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
								{book.title}
								<button onClick={() => handleRemove("have-read", book._id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
};

export default Dashboard;
