"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/frontend/commonTypes/types";
import {
	searchBooks,
	saveBookToCollection,
	recommendBook,
} from "@/frontend/services/bookServices";
import "./SearchPage.css";

export default function SearchPage() {
	const searchParams = useSearchParams(); // read query params
	const query = searchParams.get("q") || ""; // extract "q" param (search term)
	const [books, setBooks] = useState<Book[]>([]); // search results
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!query) return;
		setLoading(true);
		searchBooks(query) //call backend/Google API
			.then(setBooks) // store results
			.catch((err) =>
				setError(err instanceof Error ? err.message : "Failed to fetch books")
			)
			.finally(() => setLoading(false)); //stop loading
	}, [query]);

	async function handleRecommend(book: Book) {
		try {
			await recommendBook(book); //call service
			setMessage(`"${book.title}" has been recommended!`);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
		}
	}

	async function handleSave(
		book: Book,
		collection: "favorites" | "to-read" | "have-read" | "current-reads"
	) {
		try {
			await saveBookToCollection(book, collection);
			setMessage(`"${book.title}" added to ${collection}!`);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Something went wrong.");
		}
	}

	if (!query) return <p>Please enter a search query.</p>;
	if (loading) {
		return (
			<div className="search-page">
				<h1>Search results for “{query}”</h1>
				<div className="loading-bar" />
			</div>
		);
	}
	if (error) return <p>Error: {error}</p>;

	return (
		<div className="search-page">
			<h1>Search results for “{query}”</h1>
			{message && <p className="success-msg">{message}</p>}
			{books.length === 0 ? (
				<p>No results found.</p>
			) : (
				<div className="book-grid">
					{books.map((book) => (
						<div key={book.id} className="book-card">
							{/* Thumbnail */}
							{book.thumbnail && (
								<Image
									src={book.thumbnail}
									alt={book.title}
									width={120}
									height={180}
								/>
							)}

							{/* Title & Author */}
							<h2>{book.title}</h2>
							<p>{book.authors?.join(", ") || "Unknown Author"}</p>

							{/* Read Online */}
							{book.webReaderLink && (
								<a
									href={book.webReaderLink}
									target="_blank"
									rel="noopener noreferrer"
									className="read-online"
								>
									Read Online
								</a>
							)}

							{/* Buttons */}
							<div className="actions">
								<button
									onClick={() => handleSave(book, "current-reads")}
									className="current-btn"
								>
									📚 Current Reads
								</button>
								<button
									onClick={() => handleSave(book, "favorites")}
									className="favorite-btn"
								>
									⭐ Favorite
								</button>
								<button
									onClick={() => handleSave(book, "to-read")}
									className="to-read-btn"
								>
									To-Read
								</button>
								<button
									onClick={() => handleSave(book, "have-read")}
									className="have-read-btn"
								>
									Have-Read
								</button>
								<button
									onClick={() => handleRecommend(book)}
									className="recommend-btn"
								>
									Recommend
								</button>
							</div>

							{/* Details link */}
							<Link href={`/books/${book.id}`} className="details-link">
								View Details →
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
