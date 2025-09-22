export interface Book {
	_id: string;
	title: string;
	author: string;
	publisher?: string;
	published_date?: string;
	description?: string;
	thumbnail_url?: string;
	isbn?: string;
	category?: string;
}
