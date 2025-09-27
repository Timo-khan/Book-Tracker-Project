"use client";
import Link from "next/link";
import "./homePage.css";
import QuoteRotator from "../quotes/quotes";
import Recommended from "../recommended/Recommended";

const Homepage = () => {
	return (
		<div className="home">
			<div className="loading-bar"></div>
			{/* Hero section */}
			<section className="hero">
				<div className="hero-overlay">
					<div className="welcome">
						<h2>Hi there!</h2>
						<p>
							Glad you&apos;re here<br></br> let&apos;s start your next chapter
							together.
						</p>
						<div className="hero-buttons">
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

			<div className="sub-wrap1">
				<div className="recoPopular-wrap">
					{/* Recommended Section */}
					<section className="books-section recommended">
						<Recommended />
					</section>
					{/* Popular This Week */}
					<section className="books-section">
						<h3>Popular This Week</h3>
						<div className="book-list"></div>
					</section>
				</div>
				{/* Quotes Section */}
				<section className="quotes-section">
					<h2 className="quot">Quotes Of The Day</h2>
					<div className="quote-rotator-wrap">
						<QuoteRotator />
					</div>
				</section>
			</div>
		</div>
	);
};

export default Homepage;
