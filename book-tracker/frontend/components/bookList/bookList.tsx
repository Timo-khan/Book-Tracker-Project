"use client";
import React, { useState } from "react";
import Image from "next/image";
import { searchBooks, Book, saveBookToCollection, } from "@/frontend/services/bookServices";
import "./BookList.css";

// ensure http -> https for Next Image
const toHttps = (u?: string) => (u ? u.replace(/^http:\/\//, "https://") : u);

const BookList: React.FC = () => {
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const handleSearch = async () => {
		try {
			setLoading(true);
			setError(null);
			setMessage(null);
			setStartIndex(0); // reset pagination
			const results = await searchBooks(query, 0); // explicitly pass startIndex
			setBooks(results);
		} catch {
			setError("Something went wrong while fetching books.");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (
		book: Book,
		collection: "favorites" | "to-read" | "have-read"
	) => {
		try {
			setMessage(null);
			await saveBookToCollection(book, collection);
			setMessage(`"${book.title}" added to ${collection}!`);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Something went wrong.");
			}
		}
	};

	const [startIndex, setStartIndex] = useState(0);

	const handleLoadMore = async () => {
		try {
			setLoading(true);
			const nextIndex = startIndex + 40;
			const results = await searchBooks(query, nextIndex);
			setBooks((prev) => [...prev, ...results]); // append to existing
			setStartIndex(nextIndex);
		} catch {
			setError("Something went wrong while fetching more books.");
		} finally {
			setLoading(false);
		}
	};

	return (
		
			<div className="book-search">
				<h1>Book Search</h1>

				<div className="search-bar">
					<input
						type="text"
						placeholder="Search for books..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button onClick={handleSearch}>Search</button>
				</div>

				{loading && <p>Loading...</p>}
				{error && <p className="message error">{error}</p>}
				{message && <p className="message success">{message}</p>}

				<div className="book-grid">
					{books.map((book) => (
						<div key={book.id} className="book-card">
							{book.thumbnail && <Image
                  src={toHttps(book.thumbnail)!}
                  alt={book.title}
                  width={128}   
                  height={192}  
                  className="thumb-img"
                />}
							<h2>{book.title}</h2>
							<p>{book.authors?.join(", ") || "Unknown Author"}</p>

							{/* Read Online link */}
							{book.webReaderLink && (
								<a
									href={book.webReaderLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline text-sm mb-2 block"
								>
									Read Online
								</a>
							)}

							<div className="actions">
								<button
									className="favorite"
									onClick={() => handleSave(book, "favorites")}
								>
									Favorite
								</button>
								<button
									className="to-read"
									onClick={() => handleSave(book, "to-read")}
								>
									To-Read
								</button>
								<button
									className="have-read"
									onClick={() => handleSave(book, "have-read")}
								>
									Have-Read
								</button>
							</div>
						</div>
					))}
				</div>
				{books.length > 0 && (
					<div className="load-more">
						<button onClick={handleLoadMore}>Load More</button>
					</div>
				)}
			</div>
		
	);
};

export default BookList;
