"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Book } from "@/frontend/commonTypes/types";
import {
    getBookById,
    saveBookToCollection,
    recommendBook,
} from "@/frontend/services/bookServices";
import "./SearchById.css";
import CustomDropdown from "@/frontend/components/customDropdown/CustomDropdown";

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

    async function handleSave(
        collection: "favorites" | "to-read" | "have-read" | "current-reads"
    ) {
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
            await recommendBook(book); // call service
            setMessage(`"${book.title}" has been recommended!`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not recommend.");
        }
    }

    if (loading) return <div className="loading-bar" />;
    if (error) return <p>Error: {error}</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div className="main-wrap">
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
                    <button onClick={handleRecommend} className="recommend-btn">
                        <span>Recommend</span>
                    </button>
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
                    <CustomDropdown
                        placeholder="Add to..."
                        options={[
                            { value: "current-reads", label: "📚 Current Reads" },
                            { value: "favorites", label: "⭐ Favorites" },
                            { value: "to-read", label: "📖 To Read" },
                            { value: "have-read", label: "✅ Have Read" },
                        ]}
                        onChange={(value) =>
                            handleSave(
                                value as "favorites" | "to-read" | "have-read" | "current-reads"
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
