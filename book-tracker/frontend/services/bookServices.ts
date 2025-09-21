export interface Book {
	id: string;
	title: string;
	authors?: string[];
	publisher?: string;
	publishedDate?: string;
	description?: string;
	category?: string;
	thumbnail?: string;
	webReaderLink?: string;
	pdfLink?: string;
	epubLink?: string;
	previewLink?: string;
	infoLink?: string;
}

export interface GoogleBookItem {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		imageLinks?: {
			thumbnail?: string;
			smallThumbnail?: string;
		};
		previewLink?: string;
		infoLink?: string;
	};
	accessInfo?: {
		webReaderLink?: string;
		pdf?: {
			acsTokenLink?: string;
		};
		epub?: {
			acsTokenLink?: string;
		};
	};
}

export interface GoogleBooksResponse {
	items?: GoogleBookItem[];
}

// Force http -> https (keeps undefined as undefined)
const https = (u?: string) =>
	u ? u.replace(/^http:\/\//, "https://") : undefined;

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

// Save book to collection (favorites, to-read, have-read)
const API_BASE = "http://localhost:5002/api/collections";

export async function saveBookToCollection(
	book: Book,
	collection: "favorites" | "to-read" | "have-read"
) {
	const res = await fetch(`${API_BASE}/${collection}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include", //send JWT cookie
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
		throw new Error(err.error || "Failed to save book");
	}

	return res.json();
}
