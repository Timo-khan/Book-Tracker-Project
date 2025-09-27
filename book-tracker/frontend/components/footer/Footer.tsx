"use client";
// import Link from "next/link";
import "./footer.css";

export const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-content">
				<div className="footer-links">
                    <p>&copy; {new Date().getFullYear()} Book Heaven. All rights reserved.</p>
					{/* <Link href="/">#</Link>
					<Link href="/">#</Link>
                    <Link href="">#</Link> */}
				</div>
				
			</div>
		</footer>
	);
};