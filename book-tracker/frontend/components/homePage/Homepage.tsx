"use client";
import React from "react";
import Link from "next/link"; 
// import Image from "next/image";
import "./homePage.css";

const Homepage = () => {
	return (
		<div className="home">
			{/* Hero section */}
			<section className="hero">
				<div className="hero-overlay">
                    <div className="welcome">
					<h2>Hi there!</h2>
					<p>Let&apos;s discover your next favorite book.</p>
					<div className="hero-buttons">
              {/* ✅ Links to signup and login pages */}
              <Link href="/signup" className="primary-b">
                Sign up
              </Link>
              <Link href="/login" className="secondary-b">
                Log in
              </Link>
            </div>
				</div>
				</div>
			</section>

			{/* Popular This Week */}
			<section className="books-section">
				<h3>Popular This Week</h3>
				<div className="book-list">
					{/* <Image src="/books/book1.jpg" alt="Book 1" />
					<Image src="/books/book2.jpg" alt="Book 2" />
					<Image src="/books/book3.jpg" alt="Book 3" />
					<Image src="/books/book4.jpg" alt="Book 4" /> */}
				</div>
			</section>

			{/* Giveaways */}
			<section className="books-section">
				<h3>Recommended</h3>
				<div className="book-list">
					{/* <Image src="/books/book5.jpg" alt="Book 5" />
					<Image src="/books/book6.jpg" alt="Book 6" />
					<Image src="/books/book7.jpg" alt="Book 7" />
					<Image src="/books/book8.jpg" alt="Book 8" /> */}
				</div>
			</section>
		</div>
	);
};

export default Homepage;
