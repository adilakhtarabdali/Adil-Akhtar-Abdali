
import type { MenuItem, Modifier } from './types';

export const CATEGORY_IMAGES: Record<string, string> = {
  'Breakfast': 'https://i.ibb.co/3W6yqgX/cat-breakfast.jpg',
  'Main Courses': 'https://i.ibb.co/wYkxGv8/cat-main-courses.jpg',
  'Soups': 'https://i.ibb.co/8Y7CqS6/tom-yum-soup.jpg',
  'Burgers': 'https://i.ibb.co/hK8dK5B/beef-burger.jpg',
  'Appetizers': 'https://i.ibb.co/wJv0qQ5/samosa.jpg',
  'Beverages': 'https://i.ibb.co/JqKzTpr/teh-tarik.jpg',
  'Default': 'https://i.ibb.co/9yL6w3b/placeholder.png', // Fallback image
};

export const MODIFIERS_SAMBAL: Modifier[] = [
  { id: 1001, name: 'Extra Sambal', price: 1.50 },
  { id: 1002, name: 'No Sambal', price: 0.00 },
];

export const MODIFIERS_EGG: Modifier[] = [
    { id: 2001, name: 'Telur Mata (Sunny-side Up)', price: 1.50 },
    { id: 2002, name: 'Telur Dadar (Omelette)', price: 2.00 },
];

export const MODIFIERS_BURGER: Modifier[] = [
    { id: 3001, name: 'Extra Cheese', price: 2.00 },
    { id: 3002, name: 'Add Beef Bacon', price: 4.00 },
    { id: 3003, name: 'Extra Patty', price: 6.00 },
];

export const MODIFIERS_CURRY: Modifier[] = [
    { id: 4001, name: 'Kari Ayam (Chicken Curry)', price: 2.00 },
    { id: 4002, name: 'Kari Daging (Beef Curry)', price: 3.00 },
    { id: 4003, name: 'Dalca (Lentil Curry)', price: 1.50 },
];


export const MENU_ITEMS: MenuItem[] = [
  // Breakfast
  {
    id: 17,
    name: 'Roti Canai',
    description: 'Crispy and fluffy flatbread, a Malaysian staple. Served with your choice of curry.',
    price: 2.50,
    category: 'Breakfast',
    image: 'https://i.ibb.co/pnv1kh5/roti-canai.jpg',
    isAvailable: true,
    modifiers: MODIFIERS_CURRY,
  },
  {
    id: 18,
    name: 'Nasi Lemak Biasa',
    description: 'Fragrant coconut rice served with sambal, fried anchovies, peanuts, and a slice of cucumber.',
    price: 4.50,
    category: 'Breakfast',
    image: 'https://i.ibb.co/N2cZk0G/nasi-lemak-biasa.jpg',
    isAvailable: true,
    modifiers: [...MODIFIERS_SAMBAL, ...MODIFIERS_EGG],
  },
  // Main Courses
  {
    id: 1,
    name: 'Nasi Goreng USA',
    description: 'Stir-fried rice with a mix of chicken and prawns, topped with a fried egg and special USA sauce.',
    price: 12.00,
    category: 'Main Courses',
    image: 'https://i.ibb.co/L5B6Sj8/nasi-goren-usa.jpg',
    isAvailable: true,
    modifiers: [...MODIFIERS_SAMBAL, ...MODIFIERS_EGG],
  },
  {
    id: 2,
    name: 'Nasi Goreng Ayam',
    description: 'Classic chicken fried rice, a local favorite for a hearty meal.',
    price: 10.00,
    category: 'Main Courses',
    image: 'https://i.ibb.co/gVwJc5P/nasi-goreng-ayam.jpg',
    isAvailable: true,
    modifiers: [...MODIFIERS_SAMBAL, ...MODIFIERS_EGG],
  },
  {
    id: 3,
    name: 'Nasi Lemak Ayam Goreng',
    description: 'Coconut rice served with fried chicken, sambal, anchovies, peanuts, and cucumber.',
    price: 11.50,
    category: 'Main Courses',
    image: 'https://i.ibb.co/Jk1GzJ3/nasi-lemak-ayam-goreng.jpg',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 4,
    name: 'Mee Goreng Mamak',
    description: 'Spicy stir-fried noodles with chicken, tofu, and vegetables in a savory sauce.',
    price: 9.50,
    category: 'Main Courses',
    image: 'https://i.ibb.co/qDsyPzQ/mee-goreng-mamak.jpg',
    isAvailable: true,
    modifiers: MODIFIERS_SAMBAL,
    isFeatured: true,
  },
  {
    id: 5,
    name: 'Kuey Teow Goreng',
    description: 'Stir-fried flat rice noodles with prawns, bean sprouts, and chives.',
    price: 10.50,
    category: 'Main Courses',
    image: 'https://i.ibb.co/Yd4BwzK/kuey-teow-goreng.jpg',
    isAvailable: true,
  },
  {
    id: 6,
    name: 'Lamb Shank Biryani',
    description: 'Slow-cooked lamb shank in a rich biryani gravy, served with aromatic basmati rice.',
    price: 28.00,
    category: 'Main Courses',
    image: 'https://i.ibb.co/mHpdQj2/lamb-shank-biryani.jpg',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 7,
    name: 'Chicken Chop',
    description: 'Crispy fried chicken thigh served with fries, coleslaw, and black pepper sauce.',
    price: 15.00,
    category: 'Main Courses',
    image: 'https://i.ibb.co/vHQb42L/chicken-chop.jpg',
    isAvailable: true,
  },
  {
    id: 8,
    name: 'Nasi Ayam Penyet',
    description: 'Smashed fried chicken served with rice, sambal, and fresh vegetables.',
    price: 12.50,
    category: 'Main Courses',
    image: 'https://i.ibb.co/RScnyz4/nasi-ayam-penyet.jpg',
    isAvailable: true,
  },
  {
    id: 19,
    name: 'Nasi Kerabu',
    description: 'Aromatic blue rice served with assorted herbs, toasted coconut, and spiced fried chicken.',
    price: 13.00,
    category: 'Main Courses',
    image: 'https://i.ibb.co/hR8h5pS/nasi-kerabu.jpg',
    isAvailable: true,
  },
  // Soups
  {
    id: 20,
    name: 'Tom Yum Soup',
    description: 'Spicy and sour Thai soup with seafood, mushrooms, and fragrant herbs.',
    price: 9.00,
    category: 'Soups',
    image: 'https://i.ibb.co/8Y7CqS6/tom-yum-soup.jpg',
    isAvailable: true,
    modifiers: MODIFIERS_SAMBAL,
  },
  // Burgers
  {
    id: 9,
    name: 'AZAD Chicken Burger',
    description: 'Grilled chicken patty with lettuce, tomato, and our special sauce in a toasted bun.',
    price: 13.00,
    category: 'Burgers',
    image: 'https://i.ibb.co/Rz3z4T3/chicken-burger.jpg',
    isAvailable: true,
    modifiers: MODIFIERS_BURGER,
  },
  {
    id: 10,
    name: 'AZAD Beef Burger',
    description: 'Juicy beef patty with cheese, pickles, onions, and our signature sauce.',
    price: 14.50,
    category: 'Burgers',
    image: 'https://i.ibb.co/hK8dK5B/beef-burger.jpg',
    isAvailable: true,
    // FIX: Corrected typo from MODIFIers_BURGER to MODIFIERS_BURGER.
    modifiers: MODIFIERS_BURGER,
  },
  // Appetizers
  {
    id: 11,
    name: 'Chicken Samosa',
    description: 'Crispy pastries filled with spiced chicken, served with mint chutney.',
    price: 8.00,
    category: 'Appetizers',
    image: 'https://i.ibb.co/wJv0qQ5/samosa.jpg',
    isAvailable: true,
  },
  {
    id: 12,
    name: 'French Fries',
    description: 'Classic golden french fries, lightly salted.',
    price: 6.00,
    category: 'Appetizers',
    image: 'https://i.ibb.co/L6t6f3t/fries.jpg',
    isAvailable: true,
  },
  // Beverages
  {
    id: 13,
    name: 'Teh Tarik',
    description: 'Classic Malaysian pulled milk tea, served hot.',
    price: 3.50,
    category: 'Beverages',
    image: 'https://i.ibb.co/JqKzTpr/teh-tarik.jpg',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 14,
    name: 'Milo Dinosaur',
    description: 'Iced Milo drink topped with a generous amount of Milo powder.',
    price: 5.00,
    category: 'Beverages',
    image: 'https://i.ibb.co/dK500zV/milo-dinosaur.jpg',
    isAvailable: true,
  },
  {
    id: 15,
    name: 'Sirap Bandung',
    description: 'A refreshing drink of rose syrup mixed with condensed milk.',
    price: 4.00,
    category: 'Beverages',
    image: 'https://i.ibb.co/z572yvV/sirap-bandung.jpg',
    isAvailable: true,
  },
  {
    id: 16,
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice for a vitamin C boost.',
    price: 7.00,
    category: 'Beverages',
    image: 'https://i.ibb.co/j3gQc8W/orange-juice.jpg',
    isAvailable: false,
  },
];

export const RESTAURANT_NAME = 'AZAD ISLAMIC Restaurant';
export const ADMIN_PASSWORD = '12345678';
export const CUSTOM_ADMIN_PASSWORD_KEY = 'azad-admin-password';
export const ADMIN_PROFILE_KEY = 'azad-admin-profile';
export const MENU_STORAGE_KEY = 'azad-menu-items';
export const ORDERS_STORAGE_KEY = 'azad-orders';
export const NEW_ORDER_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/11/21/audio_a71314995f.mp3';
export const USER_PROFILE_KEY = 'azad-user-profile';
export const LOYALTY_POINTS_RATE = 1; // 1 point per RM1 spent
export const WHATSAPP_NUMBER = '60123456789'; // Use international format without '+' or spaces
export const WHATSAPP_MESSAGE = "Hello AZAD Restaurant, I have a question.";