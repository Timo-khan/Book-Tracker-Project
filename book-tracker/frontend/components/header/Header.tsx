"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchBooks, Book } from "@/frontend/services/bookServices";
import "./Header.css";

interface HeaderProps {
	onLoginClick?: () => void;
	onSignupClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
	const [isHidden, setIsHidden] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();

	// Hide header on scroll down, show on scroll up
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY && currentScrollY > 60) {
				setIsHidden(true); // scrolling down
			} else {
				setIsHidden(false); // scrolling up
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	// Live search suggestions
	useEffect(() => {
		if (!query) {
			setSuggestions([]);
			setShowDropdown(false);
			return;
		}

		setLoading(true);
		searchBooks(query, 0)
			.then((results) => {
				setSuggestions(results.slice(0, 5));
				setShowDropdown(true);
			})
			.finally(() => setLoading(false));
	}, [query]);

	// ... inside Header component
	const searchRef = useRef<HTMLDivElement | null>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Navigate to /login when button clicked
	const handleLogin = () => {
		if (onLoginClick) {
			onLoginClick(); // optional custom callback
		} else {
			router.push("/login");
		}
	};
	return (
		<header className={`headerBar ${isHidden ? "hidden" : ""}`}>
			<div className="headerContainer">
				<div className="Brand-container">
					<div className="brand-name">
						<Link href="/" className="brand">
							Book Heaven
						</Link>
					</div>
					<div className="logo">
						<Image
							src="/images/book heaven.png"
							alt="logo"
							width={50}
							height={50}
						/>
					</div>
				</div>

				{/* 🔍 Search */}
				<div className="search-container" ref={searchRef}>
					<input
						type="search"
						placeholder="Search all books..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => query && setShowDropdown(true)}
					/>
					{showDropdown && suggestions.length > 0 && (
						<div className="search-dropdown">
							{suggestions.map((book) => (
								<Link
									key={book.id}
									href={`/books/${book.id}`}
									className="search-suggestion"
									onClick={() => setShowDropdown(false)}
								>
									{book.thumbnail && (
										<Image
											src={book.thumbnail}
											alt={book.title}
											width={30}
											height={45}
										/>
									)}
									<div className="suggestion-info">
										<span className="suggestion-title">{book.title}</span>
										{book.authors && (
											<span className="suggestion-author">
												{book.authors.join(", ")}
											</span>
										)}
									</div>
								</Link>
							))}

							{suggestions.length > 0 && (
								<Link
									href={`/search?q=${encodeURIComponent(query)}`}
									className="see-more"
									onClick={() => setShowDropdown(false)}
								>
									See more results →
								</Link>
							)}
						</div>
					)}
				</div>

				<div className="loginSection" aria-label="User">
					<button onClick={handleLogin} className="loginCta">
						Let&apos;s log in
					</button>

					<div className="navVideoWrap" aria-hidden="true">
						<video
							className="navVideo"
							autoPlay
							muted
							loop
							playsInline
							preload="metadata"
							poster="/videos/loop-poster.jpg"
						>
							<source src="/videos/BOOK WALKING.mp4" type="video/mp4" />
						</video>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
