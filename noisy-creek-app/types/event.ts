export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  capacity: number | null;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: Category | null;
  venue: Venue | null;
}

export interface EventPost {
  id: number;
  event: number;
  content: string;
  created_at: string;
}