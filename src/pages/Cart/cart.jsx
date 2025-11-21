import React, { useState, useEffect, useMemo } from 'react';
// *** import utilities และ CSS ***
import { getCartItems, updateCartItemQuantity } from './cartStorage'; // ปรับ path ตามโครงสร้างจริงของคุณ
import './cart.css';

//  Import Shipping Address Selector Component
// สมมติว่าไฟล์ ShippingAddress.jsx ถูก Export เป็น default:
import ShippingAddressSelector from './Shipping address/ShippingAddress.jsx';


// **********************************************
// *** 1. Components Modal (PaymentModal ที่ใช้ API Mock) ***
// **********************************************

const PaymentModal = ({ isOpen, onClose, paymentMethod, totalAmount }) => {
    if (!isOpen) return null;

    const [transactionStatus, setTransactionStatus] = useState('pending');
    const [transactionData, setTransactionData] = useState(null);

    useEffect(() => {
        if (!isOpen || transactionStatus !== 'pending') {
            if (!isOpen) {
                setTransactionStatus('pending');
                setTransactionData(null);
            }
            return;
        }

        const mockApiCall = async () => {
            setTransactionStatus('loading');

            try {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2 วินาที

                let success = false;
                let data = {};

                
                if (paymentMethod === 'PayPal') {
                    // จำลองการเรียก PayPal API (ตั้งใจให้สำเร็จ 70% ของครั้ง)
                    success = Math.random() < 0.7;
                    data.id = success ? `PAYPAL-${Date.now()}` : '0';
                    data.message = success ? 'PayPal payment approved.' : 'PayPal denied the transaction.';
                } else {
                    // Logic เดิมสำหรับ Credit Card / Cash on Delivery
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    data = await response.json();
                    success = (data && data.id === 1);
                }


                if (success) {
                    setTransactionData(data);
                    setTransactionStatus('success');
                } else {
                    setTransactionStatus('failed');
                }

            } catch (error) {
                console.error("Payment API call failed:", error);
                setTransactionStatus('failed');
            }
        };

        mockApiCall();

    }, [isOpen, paymentMethod]); // ✅ เพิ่ม paymentMethod เป็น dependency 


    const renderContent = () => {
        if (transactionStatus === 'loading') {
            return (
                <div className="payment-loading">
                    <p>กำลังดำเนินการชำระเงินด้วย **{paymentMethod}**...</p>
                    <div className="spinner"></div>
                </div>
            );
        }

        if (transactionStatus === 'success') {
            return (
                <div className="payment-success">
                    <h3> ชำระเงินสำเร็จ!</h3>
                    <p>ขอบคุณสำหรับการสั่งซื้อสินค้า</p>
                    <p>ยอดเงินที่ชำระ: **{totalAmount.toLocaleString('th-TH')} THB**</p>
                    <p className="transaction-detail">รหัสธุรกรรม (Mock): {transactionData?.id || 'N/A'}</p>
                </div>
            );
        }

        if (transactionStatus === 'failed') {
            return (
                <div className="payment-failed">
                    <h3>การชำระเงินล้มเหลว</h3>
                    
                    <p>
                        {paymentMethod === 'PayPal' && transactionData?.message
                            ? `PayPal แจ้ง: ${transactionData.message}`
                            : `โปรดตรวจสอบข้อมูล **${paymentMethod}** และลองใหม่อีกครั้ง`}
                    </p>
                </div>
            );
        }

        return <p>โปรดรอสักครู่...</p>;
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                
                <h2>ชำระเงิน <img src="src\assets\Logo.png"  width='85px' height='55px'ppxalt="PP" /></h2>
                <div className="payment-content">
                    {renderContent()}
                </div>
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                    disabled={transactionStatus === 'loading'}
                >
                    {transactionStatus === 'success' ? 'เสร็จสิ้น' : 'ปิด'}
                </button>
            </div>
        </div>
    );
};

// **********************************************
// *** 2. Component Cart Item (เหมือนเดิม) ***
// **********************************************
const CartItem = ({ item, onQuantityChange }) => {
    const { key, name, selectedSize, price, quantity, imageUrl } = item;
    const itemTotal = price * quantity;

    const handleUpdateQuantity = (change) => {
        const newQuantity = quantity + change;
        onQuantityChange(key, newQuantity);
    };

    return (
        <div className="cart-item">
            <img src={imageUrl} alt={name} className="cart-item-image" />
            <div className="cart-item-details">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-size">{selectedSize}</p>

                <div className="quantity-control">
                    <button onClick={() => handleUpdateQuantity(-1)} disabled={quantity <= 1}>-</button>
                    <input type="number" min="1" value={quantity} readOnly />
                    <button onClick={() => handleUpdateQuantity(1)}>+</button>
                </div>
            </div>
            <div className="cart-item-price-total">
                {(itemTotal).toLocaleString('th-TH')} THB
            </div>
        </div>
    );
};


// **********************************************
// *** 3. Component หลัก: Cart ***
// **********************************************
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModal] = useState(false);
    // กำหนด default เป็น 'Credit/Debit Card' 
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit/Debit Card');

    //  สถานะใหม่สำหรับเก็บที่อยู่จัดส่งที่ถูกเลือก
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        setCartItems(getCartItems());
    }, []);

    const { total, estimatedTotal } = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0;
        return {
            total: subtotal,
            estimatedTotal: subtotal + shipping,
        };
    }, [cartItems]);

    const handleUpdateQuantity = (key, newQuantity) => {
        const updatedItems = updateCartItemQuantity(key, newQuantity);
        setCartItems(updatedItems);
    };

    //  ฟังก์ชันจัดการเมื่อเลือกที่อยู่จาก ShippingAddressSelector
    const handleAddressSelected = (address) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(false); // ปิด Modal หลังจากเลือก
        console.log("Address selected:", address);
    };


    const handleCheckout = () => {
        //  ตรวจสอบว่ามีสินค้าหรือไม่
        if (cartItems.length === 0) {
            alert('กรุณาเพิ่มสินค้าลงในตะกร้าก่อนดำเนินการชำระเงิน');
            return;
        }
        //  ตรวจสอบว่าเลือกที่อยู่จัดส่งแล้วหรือไม่
        if (!selectedAddress) {
            alert('กรุณาเลือกที่อยู่จัดส่งก่อนดำเนินการชำระเงิน');
            return;
        }

        setIsPaymentModal(false);
        setTimeout(() => setIsPaymentModal(true), 10);
    };

    const handlePaymentMethodClick = (method) => {
        setSelectedPaymentMethod(method);
        console.log(`Selected payment method: ${method}`);
    };

    return (
        <div className="cart-page-container">
            <div className="app-header">
                <navlogo-component />
            </div>

            <main className="cart-content-wrapper">
                <h1 className="shopping-bag-title">Shopping Bag</h1>

                <div className="cart-layout">

                    <div className="cart-items-list">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <CartItem
                                    key={item.key}
                                    item={item}
                                    onQuantityChange={handleUpdateQuantity}
                                />
                            ))
                        ) : (
                            <div className="empty-cart-message">
                                <h3>ตะกร้าสินค้าว่างเปล่า </h3>
                                <p>ไปเลือกน้ำหอมหอมๆ มาใส่ตะกร้ากันเถอะ!</p>
                            </div>
                        )}
                        {cartItems.length > 0 && <div className="cart-item-divider"></div>}
                    </div>

                    <div className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-line">
                            <span>Total</span>
                            <span>{total.toLocaleString('th-TH')} THB</span>
                        </div>
                        <div className="summary-line">
                            <span>Shipping</span>
                            <span className="shipping-na">N/A</span>
                        </div>

                        <div className="promotion-input">
                            <input type="text" placeholder="Promotion code 🏷️" />
                            <button className="promo-apply-btn">
                                <span role="img" aria-label="arrow">→</span>
                            </button>
                        </div>

                        {/*  แสดงที่อยู่ที่ถูกเลือก (ถ้ามี) */}
                        {selectedAddress && (
                            <div className="selected-address-display">
                                <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '5px' }}>จัดส่งถึง:</p>
                                <strong style={{ fontSize: '1em' }}>{selectedAddress.name}</strong> | {selectedAddress.phone}
                                <p style={{ fontSize: '0.9em', marginTop: '5px' }}>{selectedAddress.fullAddress.substring(0, 50)}...</p>
                                <div className="summary-divider" style={{ margin: '10px 0' }}></div>
                            </div>
                        )}

                        {/*  ปุ่ม Add/Change Address */}
                        <button
                            className="add-address-btn"
                            onClick={() => setIsAddressModalOpen(true)}
                        >
                            {selectedAddress ? 'Change address' : 'Add address'} +
                        </button>

                        <div className="summary-divider"></div>

                        <div className="summary-line estimated-total">
                            <span>Estimated Total</span>
                            <span>{estimatedTotal.toLocaleString('th-TH')} THB</span>
                        </div>

                        {/* Payment Method - ถูกแก้ไขเพื่อเพิ่ม PayPal */}
                        <div className="payment-method-section">
                            <span className="payment-label">Payment Method:</span>
                            <div className="payment-icons">
                                {/* Credit/Debit Card */}
                                <div
                                    className={`payment-icon-wrapper ${selectedPaymentMethod === 'Credit/Debit Card' ? 'active' : ''}`}
                                    onClick={() => handlePaymentMethodClick('Credit/Debit Card')}
                                >
                                    <div role="img" aria-label="card">
                                        <img src="src/assets/Credit.png" alt="card" />
                                    </div>
                                </div>

                                {/* PayPal ถูกเพิ่มที่นี่ */}
                                <div
                                    className={`payment-icon-wrapper ${selectedPaymentMethod === 'PayPal' ? 'active' : ''}`}
                                    onClick={() => handlePaymentMethodClick('PayPal')}
                                ><div role="img" aria-label="paypal">
                                        <img src="src\assets\PayPal.png"  width='40px' height='20px'ppxalt="PP" />
                                    </div>
                                </div>

                                {/* Cash on Delivery */}
                                <div
                                    className={`payment-icon-wrapper ${selectedPaymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
                                    onClick={() => handlePaymentMethodClick('Cash on Delivery')}
                                >
                                    <div role="img" aria-label="cash">
                                        <img src="src/assets/Cash.png" alt="Cash" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                            // ปุ่มถูก Disable หากไม่มีสินค้า หรือยังไม่เลือกที่อยู่
                            disabled={cartItems.length === 0 || !selectedAddress}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal ต่างๆ */}
            {isAddressModalOpen && (
                //  ใช้ ShippingAddressSelector แทน ShippingAddressModal ตัวเก่า
                <ShippingAddressSelector
                    onClose={() => setIsAddressModalOpen(false)}
                    onSelectAddress={handleAddressSelected}
                />
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModal(false)}
                paymentMethod={selectedPaymentMethod}
                totalAmount={estimatedTotal}
            />

            <footer-login-component />
        </div>
    );
};

export default Cart;
