export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;  
  menuItem: {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}
