

export interface Modifier {
  id: number;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  modifiers?: Modifier[];
  isFeatured?: boolean;
}

export interface CartItem extends MenuItem {
  cartItemId: string; // Unique ID for this specific item in the cart, including modifiers
  quantity: number;
  selectedModifiers: Modifier[];
}

export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';
export type PaymentMethod =
  | 'Cash'
  | 'Credit/Debit Card'
  | 'FPX'
  | 'Touch n Go'
  | 'GrabPay'
  | 'ShopeePay'
  | 'Boost'
  | 'Google Pay'
  | 'Apple Pay';

export type Role = 'Manager' | 'Kitchen' | 'Cashier';

export interface AdminProfile {
    role: Role;
}
  
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string; // Optional field for customer's phone number
  notes?: string; // Optional field for special requests or notes
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pointsEarned?: number;
}

export interface UserProfile {
    loyaltyPoints: number;
}

export interface OrderContextType {
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;
    updateOrderDetails: (orderId: string, details: { customerName?: string, customerPhone?: string, notes?: string }) => Promise<void>;
    updateOrderItems: (orderId: string, newItems: CartItem[], newTotal: number, newPoints: number) => Promise<void>;
    handleChangeAdminPassword: (current: string, newPass: string) => Promise<boolean>;

    // New properties for menu management
    menuItems: MenuItem[];
    categories: string[];
    addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
    updateMenuItem: (item: MenuItem) => Promise<void>;
    deleteMenuItem: (itemId: number) => Promise<void>;
    addCategory: (category: string) => void; // This doesn't mutate persisted state directly
    deleteCategory: (category: string) => Promise<boolean>; // returns success
    bulkAddMenuItems: (items: Omit<MenuItem, 'id'>[]) => Promise<void>;
    
    // Admin context
    adminProfile: AdminProfile | null;
    printOrder: (order: Order) => void;
}