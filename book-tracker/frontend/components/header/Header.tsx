"use client";

import Link from "next/link";
import React from "react";
import  "./Header.css";

interface HeaderProps {
	onLoginClick?: () => void;
	onSignupClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
	return (
		<header className= "header">
			<div className= "headerBar">
				<div className= "headerContainer">
					
					<div className= "brandSection">
						<div>
							<Link href="/" className= "brand">
								Book Heaven
							</Link>
						</div>
						<div>
							<button onClick={onSignupClick} className= "signupCta">
								Click to Sign up
							</button>
						</div>
					</div>

					
					<nav className= "authLinks" aria-label="User">
						<button onClick={onLoginClick}>Log in</button>

						<div className= "navVideoWrap" aria-hidden="true">
							<video
								className= "navVideo"
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
					</nav>
				</div>
			</div>
			<div className= "headerSpacer" />
		</header>
	);
};

export default Header;
