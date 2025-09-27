"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRecommendedBooks } from "@/frontend/services/bookServices";
import "./recommended.css";

type RecommendedBook = {
	_id: string;
	google_id: string;
	title: string;
	thumbnail_url?: string;
	author?: string;
};

export default function Recommended() {
	const [recommended, setRecommended] = useState<RecommendedBook[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchRecommended() {
			try {
				const data = await getRecommendedBooks();
				setRecommended(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchRecommended();
	}, []);

	return (
		<section className="books-section recommended">
			<div className="section-header">
				<h2>Recommended</h2>
			</div>

			<div className="book-list-wrapper">
				{loading ? (
					<div className="loader"></div>
				) : (
					<>
						<div className="book-list">
							{recommended.slice(0, 4).map((book) => (
								<a
									key={book._id}
									href={`/books/${book.google_id}`}
									className="book-card"
								>
									{book.thumbnail_url && (
										<Image
											src={book.thumbnail_url}
											alt={book.title}
											width={120}
											height={180}
										/>
									)}
								</a>
							))}
						</div>
						<button
							className="circle-btn arrow-btn"
							onClick={() => (window.location.href = "/recommended")}
						>
							→
						</button>
					</>
				)}
			</div>
		</section>
	);
}
