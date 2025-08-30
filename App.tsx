

import React, { useState, useMemo, useCallback, createContext, useEffect } from 'react';
import type { MenuItem, CartItem, Order, OrderType, Modifier, PaymentMethod, OrderContextType, UserProfile, Role, AdminProfile, OrderStatus, PaymentStatus } from './types';
import { 
    RESTAURANT_NAME, 
    LOYALTY_POINTS_RATE,
} from './constants';
import * as api from './api';

import Header from './components/Header';
import HomePage from './components/HomePage';
import OrderTypePage from './components/OrderTypePage';
import EnterTablePage from './components/EnterTablePage';
import CategoriesPage from './components/CategoriesPage';
import MenuPage from './components/MenuPage';
import Cart from './components/Cart';
import ShoppingCartIcon from './components/icons/ShoppingCartIcon';
import AdminView from './components/AdminView';
import DeliveryConfirmationPage from './components/DeliveryConfirmationPage';
import PaymentPage from './components/PaymentPage';
import AdminLoginPage from './components/AdminLoginPage';
import QRScannerPage from './components/QRScannerPage';
import ProfilePage from './components/ProfilePage';
import WhatsAppButton from './components/WhatsAppButton';
import PrintableTicket from './components/PrintableTicket';
import OrderStatusPage from './components/OrderStatusPage';
import ReceiptModal from './components/ReceiptModal';

type Page = 'home' | 'orderType' | 'enterTable' | 'deliveryConfirmation' | 'categories' | 'menu' | 'payment' | 'qrScanner' | 'profile' | 'orderStatus';
type View = 'customer' | 'admin';

export const OrderContext = createContext<OrderContextType | null>(null);

const App: React.FC = () => {
    const [view, setView] = useState<View>('customer');
    const [page, setPage] = useState<Page>('home');
    const [pageHistory, setPageHistory] = useState<Page[]>([]);
    
    const [orderType, setOrderType] = useState<OrderType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [tableNumber, setTableNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({ loyaltyPoints: 0 });
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
    const [orderForReceipt, setOrderForReceipt] = useState<Order | null>(null);
    const [orderToModifyId, setOrderToModifyId] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            const [menuData, ordersData, profileData, adminData] = await Promise.all([
                api.getMenuItems(),
                api.getOrders(),
                api.getUserProfile(),
                api.getAdminProfile(),
            ]);
            setMenuItems(menuData);
            setOrders(ordersData);
            setUserProfile(profileData);
            setAdminProfile(adminData);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const isAdminAuthenticated = !!adminProfile;

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
        return uniqueCategories.sort();
    }, [menuItems]);
    
    // --- Data Mutation Functions ---
    const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
        const newItems = [...menuItems, { ...item, id: Date.now() }];
        setMenuItems(newItems);
        await api.saveMenuItems(newItems);
    };

    const bulkAddMenuItems = async (items: Omit<MenuItem, 'id'>[]) => {
        const newItemsWithIds = items.map((item, index) => ({ ...item, id: Date.now() + index }));
        const newFullMenu = [...menuItems, ...newItemsWithIds];
        setMenuItems(newFullMenu);
        await api.saveMenuItems(newFullMenu);
    };

    const updateMenuItem = async (updatedItem: MenuItem) => {
        const newItems = menuItems.map(item => item.id === updatedItem.id ? updatedItem : item);
        setMenuItems(newItems);
        await api.saveMenuItems(newItems);
    };
    
    const deleteMenuItem = async (itemId: number) => {
        const newItems = menuItems.filter(item => item.id !== itemId);
        setMenuItems(newItems);
        await api.saveMenuItems(newItems);
    };

    const addCategory = (category: string) => {
        console.log("Adding category:", category); // No state change needed as it's derived
    };

    const deleteCategory = async (categoryToDelete: string): Promise<boolean> => {
        const itemsInCategory = menuItems.some(item => item.category === categoryToDelete);
        if (itemsInCategory) {
            alert(`Cannot delete category "${categoryToDelete}" because it still contains menu items.`);
            return false;
        }
        alert(`Category "${categoryToDelete}" deleted. (Note: Category list is auto-generated from items)`);
        return true;
    };

    const addOrder = async (newOrder: Order) => {
        const newOrders = [...orders, newOrder];
        setOrders(newOrders);
        await api.saveOrders(newOrders);
    };
    
    const updateOrderItems = async (orderId: string, newItems: CartItem[], newTotal: number, newPoints: number) => {
        const newOrders = orders.map(order => 
            order.id === orderId 
                ? { ...order, items: newItems, total: newTotal, pointsEarned: newPoints } 
                : order
        );
        setOrders(newOrders);
        await api.saveOrders(newOrders);
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
        const newOrders = orders.map(order => {
            if (order.id === orderId) {
                const updatedOrder = { ...order, status };
                if (paymentStatus) updatedOrder.paymentStatus = paymentStatus;
                if (status === 'completed' && !paymentStatus) updatedOrder.paymentStatus = 'Paid';
                return updatedOrder;
            }
            return order;
        });
        setOrders(newOrders);
        await api.saveOrders(newOrders);
    };

    const updateOrderDetails = async (orderId: string, details: { customerName?: string, customerPhone?: string, notes?: string }) => {
        const newOrders = orders.map(order => order.id === orderId ? { ...order, ...details } : order);
        setOrders(newOrders);
        await api.saveOrders(newOrders);
    };
    
    const handleChangeAdminPassword = async (current: string, newPass: string): Promise<boolean> => {
        const correctPassword = await api.getAdminPassword();
        if (current === correctPassword) {
            await api.setAdminPassword(newPass);
            return true;
        }
        return false;
    };

    const handleAdminLogin = async (password: string, role: Role): Promise<boolean> => {
        const correctPassword = await api.getAdminPassword();
        if (password === correctPassword) {
            const profile = { role };
            setAdminProfile(profile);
            await api.saveAdminProfile(profile);
            return true;
        }
        return false;
    };

    const handleAdminLogout = async () => {
        setAdminProfile(null);
        await api.clearAdminProfile();
        setView('customer');
    };

    const printOrder = (order: Order) => {
        setOrderToPrint(order);
        // This tiny delay helps ensure the component has rendered before the print dialog appears.
        setTimeout(() => {
            window.focus();
        }, 100);
    };

    // --- Navigation and Flow ---
    const navigateTo = (nextPage: Page) => {
        setPageHistory(prev => [...prev, page]);
        setPage(nextPage);
    };
    
    const resetToHome = () => {
      setPage('home');
      setPageHistory([]);
      setTableNumber('');
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
      setOrderType(null);
      setLastOrder(null);
      setOrderToModifyId(null);
    }

    const handleBack = () => {
        // If we are modifying an order and go back from the menu, just exit modification mode.
        if (orderToModifyId && (page === 'categories' || page === 'menu')) {
            setOrderToModifyId(null);
            setCart([]); // Clear cart as well
        }

        const previousPage = pageHistory.pop();
        if (previousPage) {
            setPageHistory([...pageHistory]);
            setPage(previousPage);
        } else {
            resetToHome();
        }
    };
    
    const handleSelectOrderType = (type: OrderType) => {
        setOrderType(type);
        if (type === 'Dine-in') navigateTo('enterTable');
        else if (type === 'Delivery') navigateTo('deliveryConfirmation');
        else navigateTo('categories');
    };

    const handleDeliveryConfirm = () => navigateTo('categories');
    
    const handleTableNumberSet = (table: string) => {
        setTableNumber(table);
        navigateTo('categories');
    };
    
    const handleAddToExistingOrder = (order: Order) => {
        setOrderToModifyId(order.id);
        setOrderType(order.orderType);
        setTableNumber(order.tableNumber || '');
        setLastOrder(order);
        navigateTo('categories');
    };

    const handleQRScanSuccess = (table: string) => {
        setOrderType('Dine-in');
        setTableNumber(table);
        navigateTo('categories');
    };

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        navigateTo('menu');
    };
    
    // --- Cart Management ---
    const addToCart = useCallback((item: MenuItem, selectedModifiers: Modifier[]) => {
        const cartItemId = `${item.id}-${selectedModifiers.map(m => m.id).sort().join('-')}`;
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.cartItemId === cartItemId);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.cartItemId === cartItemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, selectedModifiers, cartItemId }];
        });
    }, []);

    const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
        } else {
            setCart(prevCart =>
                prevCart.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
            );
        }
    }, []);

    const handleClearCart = useCallback(() => setCart([]), []);

    const handleCheckout = async (details: { customerName: string; customerPhone: string; notes: string }) => {
        setCustomerName(details.customerName);
        setCustomerPhone(details.customerPhone);
        setNotes(details.notes);
        setIsCartOpen(false);
        navigateTo('payment');
    }
    
    const placeOrder = async (paymentMethod: PaymentMethod) => {
        if (orderToModifyId) {
            const existingOrder = orders.find(o => o.id === orderToModifyId);
            if (!existingOrder) {
                console.error("Could not find order to modify.");
                resetToHome();
                return;
            }
            const combinedItems = [...existingOrder.items, ...cart];
            const newTotal = combinedItems.reduce((sum, item) => {
                const modifiersTotal = item.selectedModifiers.reduce((modSum, mod) => modSum + mod.price, 0);
                return sum + (item.price + modifiersTotal) * item.quantity;
            }, 0);
            const newPoints = Math.floor(newTotal * LOYALTY_POINTS_RATE);
            
            await updateOrderItems(orderToModifyId, combinedItems, newTotal, newPoints);
            setLastOrder({ ...existingOrder, items: combinedItems, total: newTotal, pointsEarned: newPoints });

            const newProfile = { ...userProfile, loyaltyPoints: userProfile.loyaltyPoints + (newPoints - (existingOrder.pointsEarned || 0)) };
            setUserProfile(newProfile);
            await api.saveUserProfile(newProfile);

        } else {
            // This is a new order
            if (!orderType) return;
            const total = cart.reduce((sum, item) => {
              const modifiersTotal = item.selectedModifiers.reduce((modSum, mod) => modSum + mod.price, 0);
              return sum + (item.price + modifiersTotal) * item.quantity;
            }, 0);
            const pointsEarned = Math.floor(total * LOYALTY_POINTS_RATE);

            const newOrder: Order = {
                id: new Date().getTime().toString(),
                orderType,
                items: cart,
                total,
                timestamp: new Date(),
                status: 'new',
                paymentMethod,
                paymentStatus: 'Pending',
                notes,
                pointsEarned,
                ...(orderType === 'Dine-in' ? { tableNumber } : { customerName, customerPhone }),
            };

            await addOrder(newOrder);
            setLastOrder(newOrder);
            
            const newProfile = { ...userProfile, loyaltyPoints: userProfile.loyaltyPoints + pointsEarned };
            setUserProfile(newProfile);
            await api.saveUserProfile(newProfile);
        }

        // Reset cart and navigation
        setCart([]);
        setOrderToModifyId(null);
        setPage('orderStatus');
        setPageHistory(prev => [...prev, 'payment']);
    };

    // --- Derived State and UI Logic ---
    const visibleMenuItems = useMemo(() => menuItems.filter(item => item.category === selectedCategory), [selectedCategory, menuItems]);
    const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const newOrderCount = useMemo(() => orders.filter(o => o.status === 'new').length, [orders]);

    useEffect(() => {
        if (view === 'admin' && adminProfile?.role === 'Manager') {
            if (newOrderCount > 0) {
                document.title = `(${newOrderCount}) New Orders | ${RESTAURANT_NAME}`;
            } else {
                document.title = `Manager Dashboard | ${RESTAURANT_NAME}`;
            }
        } else {
            document.title = RESTAURANT_NAME;
        }
    }, [view, newOrderCount, adminProfile]);

    const getPageTitle = (): string => {
        if (view === 'admin') {
            if (!isAdminAuthenticated) return 'Admin Login';
            return `${adminProfile?.role} Dashboard`;
        }
        if (orderToModifyId) return 'Add to Your Order';
        switch (page) {
            case 'home': return `Welcome to ${RESTAURANT_NAME}`;
            case 'orderType': return 'Select Order Type';
            case 'enterTable': return 'Enter Table Number';
            case 'qrScanner': return 'Scan Table QR Code';
            case 'deliveryConfirmation': return 'Confirm Delivery Area';
            case 'categories': return 'Select a Category';
            case 'menu': return selectedCategory;
            case 'payment': return 'Complete Your Order';
            case 'profile': return 'My Orders & Rewards';
            case 'orderStatus': return 'Your Order Status';
            default: return RESTAURANT_NAME;
        }
    };
    
    const currentOrderStatus = useMemo(() => {
        if (!lastOrder) return 'new';
        const updatedOrder = orders.find(o => o.id === lastOrder.id);
        return updatedOrder ? updatedOrder.status : 'new';
    }, [lastOrder, orders]);

    const renderCustomerView = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full">Loading...</div>;
        }
        switch (page) {
            case 'home': return <HomePage onNewOrder={() => navigateTo('orderType')} onScanQR={() => navigateTo('qrScanner')} />;
            case 'orderType': return <OrderTypePage onSelect={handleSelectOrderType} />;
            case 'enterTable': return <EnterTablePage onConfirm={handleTableNumberSet} />;
            case 'qrScanner': return <QRScannerPage onScanSuccess={handleQRScanSuccess} />;
            case 'deliveryConfirmation': return <DeliveryConfirmationPage onConfirm={handleDeliveryConfirm} />;
            case 'categories': return <CategoriesPage categories={categories} menuItems={menuItems} onSelectCategory={handleSelectCategory} onAddToCart={addToCart} />;
            case 'menu': return <MenuPage category={selectedCategory} items={visibleMenuItems} onAddToCart={addToCart} />;
            case 'payment': return <PaymentPage cartItems={cart} orderType={orderType!} tableNumber={tableNumber} customerName={customerName} customerPhone={customerPhone} notes={notes} onPlaceOrder={placeOrder} />
            case 'profile': return <ProfilePage userProfile={userProfile} orders={orders} onViewReceipt={setOrderForReceipt} onAddToOrder={handleAddToExistingOrder} />;
            case 'orderStatus': return <OrderStatusPage order={lastOrder} currentStatus={currentOrderStatus} onNewOrder={resetToHome} />;
            default: return <HomePage onNewOrder={() => navigateTo('orderType')} onScanQR={() => navigateTo('qrScanner')} />;
        }
    }
    
    return (
        <OrderContext.Provider value={{ 
            orders, addOrder, updateOrderStatus, updateOrderDetails, updateOrderItems, handleChangeAdminPassword,
            menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory,
            deleteCategory, bulkAddMenuItems, adminProfile, printOrder
        }}>
            <div className="relative h-screen w-screen max-w-md mx-auto bg-app-bg font-sans flex flex-col shadow-2xl">
                <Header 
                    title={getPageTitle()}
                    showBackButton={view === 'customer' && page !== 'home'}
                    onBack={handleBack}
                    currentView={view}
                    onSwitchView={setView}
                    isAdminAuthenticated={isAdminAuthenticated}
                    onLogout={handleAdminLogout}
                    onNavigateToProfile={() => navigateTo('profile')}
                    orderToModifyId={orderToModifyId}
                />
                
                <main className={`flex-grow overflow-y-auto ${page === 'home' ? '' : 'p-4'}`}>
                    {view === 'customer' ? (
                        renderCustomerView()
                    ) : isAdminAuthenticated ? (
                        <AdminView />
                    ) : (
                        <AdminLoginPage onLogin={handleAdminLogin} />
                    )}
                </main>

                {view === 'customer' && <WhatsAppButton />}

                {view === 'customer' && cart.length > 0 && !['payment', 'orderStatus'].includes(page) && (
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="absolute bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-20"
                        aria-label={`View cart with ${cartTotalItems} items`}
                    >
                         <ShoppingCartIcon />
                        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary text-brand-dark text-xs font-bold">
                            {cartTotalItems}
                        </span>
                    </button>
                )}

                <Cart 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                    cartItems={cart} 
                    orderType={orderType}
                    tableNumber={tableNumber}
                    onUpdateQuantity={updateQuantity}
                    onCheckout={handleCheckout}
                    onClearCart={handleClearCart}
                    isModifyingOrder={!!orderToModifyId}
                />
                
                {orderToPrint && <PrintableTicket order={orderToPrint} onClose={() => setOrderToPrint(null)} />}
                {orderForReceipt && <ReceiptModal order={orderForReceipt} onClose={() => setOrderForReceipt(null)} />}
            </div>
        </OrderContext.Provider>
    );
};

export default App;