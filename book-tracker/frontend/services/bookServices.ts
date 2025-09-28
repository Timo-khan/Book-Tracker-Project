import { Book, GoogleBooksResponse } from "../commonTypes/types";

// Force http https (keeps undefined as undefined)
const https = (u?: string) =>
	u ? u.replace(/^http:\/\//, "https://") : undefined;

//  Base API URL: use Render backend in production, fallback to localhost in dev
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Collections & Recommended endpoints
const COLLECTIONS_API = `${API_BASE}/collections`;
const RECOMMENDED_API = `${API_BASE}/recommended`;

// Google Books API
export async function searchBooks(
	query: string,
	startIndex = 0
): Promise<Book[]> {
	const res = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
			query
		)}&maxResults=40&startIndex=${startIndex}`
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch books: ${res.statusText}`);
	}

	const data: GoogleBooksResponse = await res.json();

	return (data.items || []).map((item) => ({
		id: item.id,
		title: item.volumeInfo.title,
		authors: item.volumeInfo.authors,
		thumbnail: item.volumeInfo.imageLinks?.thumbnail,
		webReaderLink: item.accessInfo?.webReaderLink,
		pdfLink: item.accessInfo?.pdf?.acsTokenLink,
		epubLink: item.accessInfo?.epub?.acsTokenLink,
		previewLink: https(item.volumeInfo.previewLink),
		infoLink: https(item.volumeInfo.infoLink),
	}));
}

// Fetch single book by ID
export async function getBookById(id: string): Promise<Book> {
	const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);

	if (!res.ok) {
		throw new Error(`Failed to fetch book with id ${id}`);
	}

	const data = await res.json();
	const b = data.volumeInfo;

	return {
		id: data.id,
		title: b.title,
		authors: b.authors,
		publisher: b.publisher,
		publishedDate: b.publishedDate,
		description: b.description,
		category: b.categories?.[0],
		thumbnail: b.imageLinks?.thumbnail,
		webReaderLink: data.accessInfo?.webReaderLink,
		pdfLink: data.accessInfo?.pdf?.acsTokenLink,
		epubLink: data.accessInfo?.epub?.acsTokenLink,
		previewLink: https(b.previewLink),
		infoLink: https(b.infoLink),
	};
}

// Collections
export async function saveBookToCollection(
	book: Book,
	collection: "favorites" | "to-read" | "have-read" | "current-reads"
) {
	const res = await fetch(`${COLLECTIONS_API}/${collection}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({
			google_id: book.id,
			title: book.title,
			author: book.authors?.join(", ") ?? null,
			publisher: book.publisher ?? null,
			published_date: book.publishedDate ?? null,
			description: book.description ?? null,
			category: book.category ?? null,
			thumbnail_url: book.thumbnail ?? null,
			webReaderLink: book.webReaderLink ?? null,
			pdfLink: book.pdfLink ?? null,
			epubLink: book.epubLink ?? null,
		}),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "You need to sign in to save books");
	}

	return res.json();
}

// Recommended
export async function recommendBook(book: Book) {
	const res = await fetch(RECOMMENDED_API, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({
			google_id: book.id,
			title: book.title,
			author: book.authors?.join(", "),
			thumbnail_url: book.thumbnail,
			publisher: book.publisher,
			published_date: book.publishedDate,
			description: book.description,
		}),
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.error || "Failed to recommend");
	}
	return data;
}

export async function getRecommendedBooks() {
	const res = await fetch(RECOMMENDED_API, {
		method: "GET",
		credentials: "include",
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch recommended books");
	}
	return data;
}

// Current Reads
export async function transferCurrentRead(id: string) {
	const res = await fetch(`${COLLECTIONS_API}/current-reads/${id}/transfer`, {
		method: "POST",
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to transfer");
	return data;
}

export async function getCurrentReads() {
	const res = await fetch(`${COLLECTIONS_API}/current-reads`, {
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to load current reads");
	return data;
}

// User and Collections
export async function getUser() {
	const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Not authenticated");
	return data.user;
}

export async function getFavorites() {
	const res = await fetch(`${COLLECTIONS_API}/favorites`, {
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to load favorites");
	return data;
}

export async function getToRead() {
	const res = await fetch(`${COLLECTIONS_API}/to-read`, {
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to load to-read");
	return data;
}

export async function getHaveRead() {
	const res = await fetch(`${COLLECTIONS_API}/have-read`, {
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to load have-read");
	return data;
}

export async function getCurrentRead() {
	const res = await fetch(`${COLLECTIONS_API}/current-reads`, {
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to load current reads");
	return data;
}
