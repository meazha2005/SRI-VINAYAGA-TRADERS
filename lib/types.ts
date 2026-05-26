// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
  category_slug: string;
  description: string | null;
  details: string | null;
  price_label: string;
  availability: 'in_stock' | 'out_of_stock' | 'on_order';
  brand: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

// Cart types
export interface CartItem {
  product_id: number;
  name: string;
  image_url: string | null;
  category_slug: string;
  quantity: number;
  price_label: string;
}

// Contact message types
export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

// Booking types
export interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  preferred_date: string;
  preferred_time: string | null;
  items_description: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Enquiry types
export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  items: CartItem[];
  notes: string | null;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProducts: number;
  totalMessages: number;
  newMessages: number;
  totalBookings: number;
  pendingBookings: number;
  totalEnquiries: number;
  newEnquiries: number;
}
