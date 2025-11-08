import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            return JSON.parse(cartData);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return { items: [], total: 0, itemCount: 0 };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

// Calculate cart totals
const calculateTotals = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    return { total, itemCount };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            
            // Check if product already exists in cart
            const existingItem = state.items.find(item => item.productId === product._id);
            
            if (existingItem) {
                // Update quantity
                existingItem.quantity += quantity;
            } else {
                // Add new item
                state.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0]?.url || '',
                    quantity,
                    stock: product.stock
                });
            }
            
            // Recalculate totals
            const { total, itemCount } = calculateTotals(state.items);
            state.total = total;
            state.itemCount = itemCount;
            
            // Save to localStorage
            saveCartToStorage(state);
        },
        
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.productId !== productId);
            
            // Recalculate totals
            const { total, itemCount } = calculateTotals(state.items);
            state.total = total;
            state.itemCount = itemCount;
            
            // Save to localStorage
            saveCartToStorage(state);
        },
        
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            
            if (item) {
                // Ensure quantity doesn't exceed stock
                item.quantity = Math.min(quantity, item.stock);
                
                // Recalculate totals
                const { total, itemCount } = calculateTotals(state.items);
                state.total = total;
                state.itemCount = itemCount;
                
                // Save to localStorage
                saveCartToStorage(state);
            }
        },
        
        incrementQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.productId === productId);
            
            if (item && item.quantity < item.stock) {
                item.quantity += 1;
                
                // Recalculate totals
                const { total, itemCount } = calculateTotals(state.items);
                state.total = total;
                state.itemCount = itemCount;
                
                // Save to localStorage
                saveCartToStorage(state);
            }
        },
        
        decrementQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.productId === productId);
            
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                
                // Recalculate totals
                const { total, itemCount } = calculateTotals(state.items);
                state.total = total;
                state.itemCount = itemCount;
                
                // Save to localStorage
                saveCartToStorage(state);
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
            
            // Save to localStorage
            saveCartToStorage(state);
        },
        
        loadCart: (state) => {
            const cart = loadCartFromStorage();
            state.items = cart.items;
            state.total = cart.total;
            state.itemCount = cart.itemCount;
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    loadCart
} = cartSlice.actions;

export default cartSlice.reducer;

