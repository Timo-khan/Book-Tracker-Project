export interface User {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	image?: string;
}

// Shape of a Book object that your app will use internally
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

// Shape of a single book item as returned from Google Books API
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

// Shape of the entire response from a Google Books API search
export interface GoogleBooksResponse {
	items?: GoogleBookItem[];
}
