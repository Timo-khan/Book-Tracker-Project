"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
	getBookById,
	saveBookToCollection,
	Book,
} from "@/frontend/services/bookServices";
import "./BookPage.css";

export default function BookPage() {
	const { id } = useParams();
	const [book, setBook] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		getBookById(id as string)
			.then(setBook)
			.catch((err: unknown) => {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Failed to fetch book");
				}
			})
			.finally(() => setLoading(false));
	}, [id]);

	async function handleSave(collection: "favorites" | "to-read" | "have-read") {
		if (!book) return;
		try {
			await saveBookToCollection(book, collection);
			setMessage(`"${book.title}" added to ${collection}!`);
			setError(null);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Could not save book.");
			}
		}
	}

	async function handleRecommend() {
		if (!book) return;
		try {
			const res = await fetch("http://localhost:5002/api/recommended", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					google_id: book.id,
					title: book.title,
					author: book.authors?.join(", "),
					thumbnail_url: book.thumbnail,
					publisher: book.publisher,
					published_date: book.publishedDate,
					description: book.description,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to recommend");
			setMessage(`⭐ "${book.title}" has been recommended!`);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Could not recommend.");
		}
	}

	if (loading) return <p>Loading book...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!book) return <p>Book not found.</p>;

	return (
		<div className="book-detail">
			{/* Left: Cover */}
			<div className="book-cover">
				{book.thumbnail && (
					<Image
						src={book.thumbnail}
						alt={book.title}
						width={250}
						height={360}
					/>
				)}
			</div>

			{/* Middle: Info */}
			<div className="book-info">
				<h1>{book.title}</h1>
				{book.authors && <h3>{book.authors.join(", ")}</h3>}
				<p>
					{book.publishedDate && `${book.publishedDate}`}{" "}
					{book.publisher && `• ${book.publisher}`}
				</p>
				<p>{book.description || "No description available."}</p>
				{message && <p className="success-msg">{message}</p>}
			</div>

			{/* Right: Actions */}
			<div className="book-actions">
				<select
					defaultValue=""
					onChange={(e) =>
						handleSave(e.target.value as "favorites" | "to-read" | "have-read")
					}
				>
					<option value="" disabled>
						Add to...
					</option>
					<option value="favorites">❤️ Favorites</option>
					<option value="to-read">📖 To Read</option>
					<option value="have-read">✅ Have Read</option>
				</select>
				<button onClick={handleRecommend}>⭐ Recommend</button>
			</div>
		</div>
	);
}
