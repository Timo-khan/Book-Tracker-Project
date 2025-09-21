"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./Header.css";

interface HeaderProps {
	onLoginClick?: () => void;
	onSignupClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
	const [isHidden, setIsHidden] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const router = useRouter();

	// ✅ Hide header on scroll down, show on scroll up
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

	// ✅ Navigate to /login when button clicked
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
