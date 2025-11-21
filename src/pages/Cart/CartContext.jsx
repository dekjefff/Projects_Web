// CartContext.jsx (ใช้ชื่อไฟล์ที่คุณตั้งไว้เดิม)
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- เพิ่ม: นำเข้า useNavigate สำหรับ CartPage
import './cart.css'; 

// ***********************************************
// *** Cart Context (ที่คุณให้มา) ***
// ***********************************************
const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    // โครงสร้างสินค้าในตะกร้า: { id, name, size, price, imageUrl, quantity }
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (productToAdd) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.id === productToAdd.id && item.size === productToAdd.size
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                return [...prevItems, { ...productToAdd, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (id, size, delta) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === id && item.size === size) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(item => item !== null);
        });
    };

    const calculateTotal = () => {
        // ดึง api มา(price)รวมกัน
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const contextValue = {
        cartItems,
        addToCart,
        updateQuantity,
        calculateTotal,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
// *** สิ้นสุด Cart Context ***
// ***********************************************


// ***********************************************
// *** CartPage Component (สร้างใหม่ตามรูป) ***
// ***********************************************

// สร้าง Component เพื่อแสดงหน้า Cart
const CartPage = () => {
    const { cartItems, updateQuantity, calculateTotal } = useCart();
    const navigate = useNavigate(); // สำหรับเปลี่ยนหน้า
    
    const total = calculateTotal();
    const shipping = 'N/A';
    const estimatedTotal = total; 

    const handleAddAddressClick = () => {
        // ปุ่ม Add address สามารถลิ้งกับหน้า shipping address ได้
        navigate('/shipping-address'); 
    };

    const handleCheckout = () => {
        // หลังจาก กดcheck outจะ เชื่อมไปตาม apiที่ชำระเงิน
        console.log("Calling Payment API for total:", estimatedTotal);
        alert("Proceed to checkout and call payment API.");
    };

    const handleQuantityChange = (item, delta) => {
        updateQuantity(item.id, item.size, delta);
    };

    return (
        <div className="cart-page-container">
            {/* จำลอง Header Logo */}
            <navbar-component/>
            
            <div className="cart-content-wrapper" style={{ display: 'flex', maxWidth: '1200px', margin: '40px auto', gap: '40px' }}>
                
                {/* Shopping Bag Section */}
                <div className="shopping-bag-section" style={{ flex: '2', paddingRight: '40px', borderRight: '1px solid #ddd' }}>
                    <h1 className="shopping-bag-title" style={{ fontSize: '32px', marginBottom: '20px' }}>Shopping Bag</h1>
                    <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} />
                    
                    {cartItems.length === 0 ? (
                        <div style={{ padding: '50px 0', textAlign: 'center', color: '#888' }}>Your shopping bag is empty.</div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="cart-item" style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                {/* Image */}
                                <img src={item.imageUrl || 'path/to/default-image.jpg'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }} />
                                
                                {/* Item Details */}
                                <div className="item-details" style={{ flexGrow: 1 }}>
                                    <h2 style={{ fontSize: '18px', margin: '0' }}>{item.name}</h2>
                                    <p style={{ fontSize: '14px', color: '#666' }}>{item.size}</p>
                                </div>
                                
                                {/* Quantity Control */}
                                <div className="item-quantity-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', marginRight: '20px' }}>
                                    <button style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer' }} onClick={() => handleQuantityChange(item, -1)}>−
                                    </button>
                                    <input type="text" readOnly value={item.quantity} style={{ width: '30px', textAlign: 'center', border: 'none' }} />
                                    <button style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer' }} onClick={() => handleQuantityChange(item, 1)}>+
                                    </button>
                                </div>
                                
                                {/* Item Price */}
                                <div className="item-price" style={{ width: '120px', textAlign: 'right', fontWeight: 'bold' }}>
                                    {(item.price * item.quantity).toLocaleString('th-TH')} THB
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order Summary Section */}
                <div className="order-summary-section" style={{ flex: '1', paddingLeft: '40px', background: '#F9F7F5', padding: '20px', borderRadius: '8px' }}>
                    <h2 className="summary-title" style={{ fontSize: '24px', fontWeight: 'normal', marginBottom: '20px' }}>Order Summary</h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Total</span>
                        <span className="summary-value">{total.toLocaleString('th-TH')} THB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                        <span>Shipping</span>
                        <span className="summary-value">{shipping}</span>
                    </div>
                    
                    {/* Promotion Code */}
                    <div style={{ display: 'flex', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', background: 'white' }}>
                        <input type="text" placeholder="Promotion code" readOnly style={{ flexGrow: 1, border: 'none', outline: 'none' }} />
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <span style={{ fontSize: '18px' }}>&gt;</span>
                        </button>
                    </div>
                    
                    {/* Add Address */}
                    <div style={{ display: 'flex', border: '1px solid #ddd', padding: '10px', marginBottom: '30px', background: 'white' }}>
                        <button 
                            onClick={handleAddAddressClick} // <--- เชื่อมไปหน้า Shipping Address
                            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flexGrow: 1 }}
                        >
                            Add address +
                        </button>
                    </div>
                    
                    {/* Estimated Total */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' }}>
                        <span>Estimated Total</span>
                        <span className="summary-value-large">{estimatedTotal.toLocaleString('th-TH')} THB</span>
                    </div>
                    
                    {/* Payment Method */}
                    <div style={{ marginBottom: '20px' }}>
                        <span>Payment Method:</span>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                            {/* Icon ชำระเงิน */}
                            <span style={{ border: '1px solid #333', padding: '5px', borderRadius: '4px' }}>💳</span>
                            <span style={{ border: '1px solid #333', padding: '5px', borderRadius: '4px' }}>Pay</span>
                            <span style={{ border: '1px solid #333', padding: '5px', borderRadius: '4px' }}>Visa</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCheckout}
                        style={{ width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}
                    >
                        CHECKOUT
                    </button>
                </div>
            </div>
            
            <footer-main-component />
        </div>
    );
};

export default CartPage;