"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image";
import "./homePage.css";

const quotes = [
	"“A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin",
	"“So many books, so little time.” – Frank Zappa",
	"“The only thing you absolutely have to know is the location of the library.” – Albert Einstein",
	"“Once you learn to read, you will be forever free.” – Frederick Douglass",
	"“A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin",
	"“So many books, so little time.” – Frank Zappa",
	"“The only thing you absolutely have to know is the location of the library.” – Albert Einstein",
	"“Once you learn to read, you will be forever free.” – Frederick Douglass",
	"“Reading gives us someplace to go when we have to stay where we are.” – Mason Cooley",
	"“Until I feared I would lose it, I never loved to read. One does not love breathing.” – Harper Lee",
	"“I have always imagined that Paradise will be a kind of library.” – Jorge Luis Borges",
	"“You can never get a cup of tea large enough or a book long enough to suit me.” – C.S. Lewis",
	"“That’s the thing about books. They let you travel without moving your feet.” – Jhumpa Lahiri",
	"“Books are a uniquely portable magic.” – Stephen King",
	"“We read to know we are not alone.” – William Nicholson",
	"“The more that you read, the more things you will know. The more that you learn, the more places you’ll go.” – Dr. Seuss",
	"“There is no friend as loyal as a book.” – Ernest Hemingway",
	"“Books are mirrors: you only see in them what you already have inside you.” – Carlos Ruiz Zafón",
	"“A book is a dream you hold in your hands.” – Neil Gaiman",
	"“Books are the plane, and the train, and the road. They are the destination and the journey. They are home.” – Anna Quindlen",

	"“Reading is essential for those who seek to rise above the ordinary. It opens doors to new perspectives, challenges the mind, and stretches the imagination.” – Jim Rohn",

	"“I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.” – Groucho Marx",

	"“There is more treasure in books than in all the pirate’s loot on Treasure Island, and the best of all, you can enjoy these riches every day of your life.” – Walt Disney",

	"“No two persons ever read the same book. A story lives as many lives as it has readers, each carrying away something that belongs uniquely to them.” – W. Somerset Maugham",

	"“Some books are to be tasted, others to be swallowed, and a few to be chewed and digested; that is, some books are to be read only in parts, others to be read, but not curiously, and some few to be read wholly, and with diligence and attention.” – Francis Bacon",

	"“The reading of all good books is like conversation with the finest people of the past centuries.” – René Descartes",

	"“That’s the thing about books. They let you travel the world without ever leaving your chair, and they let you live a thousand different lives without ever leaving your own.” – Unknown",

	"“When you read a book, you build a house in your imagination. Each page is a brick, each chapter a wall, and by the time you close the cover, you’ve built a world in which you can live forever.” – Unknown",
	"“A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin",

	"“I have always imagined that Paradise will be a kind of library. A place where every story you could ever need waits patiently for you to open its cover.” – Jorge Luis Borges",

	"“Books are mirrors: you only see in them what you already have inside you. That is why some books change us forever—because they reveal the parts of ourselves we didn’t know were waiting to be seen.” – Carlos Ruiz Zafón",

	"“The only thing you absolutely have to know, is the location of the library. For in that space lives every dream, every answer, and every adventure a person could ask for.” – Albert Einstein",

	"“We read to know we are not alone. Between the lines of another’s story, we discover reflections of our own, and realize our struggles and hopes are part of something bigger.” – C.S. Lewis",

	"“Once you learn to read, you will be forever free. A book is a key, unlocking worlds within worlds, and with each page turned, the door to freedom opens wider.” – Frederick Douglass",

	"“You can never get a cup of tea large enough or a book long enough to suit me. For in reading, time ceases to matter, and the soul finds its truest rest.” – C.S. Lewis",

	"“A room without books is like a body without a soul. Every book you bring into your life adds light, warmth, and a voice that will never fade.” – Marcus Tullius Cicero",

	"“Stories have to be told or they die, and when they die, we can’t remember who we are or why we are here. Books keep us tethered to our humanity.” – Sue Monk Kidd",

	"“To learn to read is to light a fire; every syllable that is spelled out is a spark. With each page, a flame grows brighter, guiding us through darkness.” – Victor Hugo",
];

const Homepage = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
		}, 5000); // every 5 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="home">
			{/* Hero section */}
			<section className="hero">
				<div className="hero-overlay">
					<div className="welcome">
						<h2>Hi there!</h2>
						<p>Let&apos;s discover your next favorite book.</p>
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

			{/* Quotes Section */}
			<section className="quotes-section">
				<div key={currentIndex} className="quote-card fade">
					<p>{quotes[currentIndex]}</p>
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
