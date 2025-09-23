"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { searchBooks, Book } from "@/frontend/services/bookServices";
import "./Header.css";

interface HeaderProps {
	onLoginClick?: () => void;
	onSignupClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
	const [isHidden, setIsHidden] = useState(false); // hide header on scroll down
	const [lastScrollY, setLastScrollY] = useState(0); // track scroll position
	const [query, setQuery] = useState(""); // search input text
	const [suggestions, setSuggestions] = useState<Book[]>([]); // search suggestions
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter(); // Next.js router instance to programmatically navigate, router.push("/login"))
	const pathname = usePathname();// Gives you the current URL path (e.g., "/login", "/dashboard")

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

	// Used to detect clicks outside and close the search suggestions dropdown
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

	//Hide header on login page
	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

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
						<Image src="/images/logo1.png" alt="logo" width={50} height={50} />
					</div>
				</div>

				<div className="search-pageRdr">
					<div className="rdr-links">
						<Link href="/">#</Link>
						<Link href="/">Contact</Link>
						<Link href="">About Us</Link>
					</div>

					{/* 🔍 Search */}
					<div className="search-container" ref={searchRef}>
						<div className="search-box">
						<input
							type="search"
							placeholder="Search books..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onFocus={() => query && setShowDropdown(true)}
						/>

						
						{loading && <div className="spinner"></div>}
						</div>

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
												width={75}
												height={95}
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
				</div>

				<div className="loginSection" aria-label="User">
					{/*Hide on login, signup, and dashboard */}
					{pathname !== "/login" &&
						pathname !== "/signup" &&
						pathname !== "/dashboard" && (
							<button onClick={handleLogin} className="loginCta">
								Let&apos;s log in
							</button>
						)}

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
