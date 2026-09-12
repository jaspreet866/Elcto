import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from './usecontext';
import './MiniCartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 2999; // Currency threshold for free shipping badge

export const MiniCartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        cartTotal,
        cartCount,
        updateCartQty,
        removeCartItem,
        id
    } = React.useContext(Context);

    const navigate = useNavigate();

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, setIsCartOpen]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    const progressPercentage = useMemo(() => {
        if (cartTotal >= FREE_SHIPPING_THRESHOLD) return 100;
        return Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100));
    }, [cartTotal]);

    const amountNeededForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

    const handleCheckout = () => {
        setIsCartOpen(false);
        if (id) {
            navigate(`/checkout?id=${id}`, { state: { totalprice: cartTotal } });
        } else {
            navigate('/login');
        }
    };

    const handleViewFullCart = () => {
        setIsCartOpen(false);
        if (id) {
            navigate(`/cart?id=${id}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="minicart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setIsCartOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <motion.aside
                        className="minicart-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping Cart Drawer"
                    >
                        {/* Header */}
                        <div className="minicart-header">
                            <div className="minicart-title-wrap">
                                <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                                    <i className="bi bi-bag-check-fill text-primary"></i> Your Cart
                                </h5>
                                <span className="minicart-badge">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                            </div>
                            <button
                                className="minicart-close-btn"
                                onClick={() => setIsCartOpen(false)}
                                aria-label="Close cart drawer"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Free Shipping Milestone */}
                        <div className="minicart-shipping-banner">
                            <div className="minicart-shipping-text">
                                {progressPercentage >= 100 ? (
                                    <span className="text-success d-flex align-items-center gap-1">
                                        <i className="bi bi-patch-check-fill"></i> You unlocked <strong>FREE Express Shipping</strong>!
                                    </span>
                                ) : (
                                    <span>
                                        Add <strong className="text-primary">₹{amountNeededForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Shipping</strong>
                                    </span>
                                )}
                                <span className="text-muted small">{progressPercentage}%</span>
                            </div>
                            <div className="minicart-progress-track">
                                <div
                                    className="minicart-progress-fill"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="minicart-body">
                            {cartItems.length === 0 ? (
                                <div className="minicart-empty">
                                    <div className="minicart-empty-icon">
                                        <i className="bi bi-cart-x"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2">Your cart is empty</h5>
                                    <p className="text-muted small mb-4">
                                        Explore our latest electronics and discover top flagship gear.
                                    </p>
                                    <button
                                        className="minicart-btn-checkout"
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/');
                                        }}
                                    >
                                        Start Exploring <i className="bi bi-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item._id || index}
                                            className="minicart-item"
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        >
                                            <img
                                                src={item.Img}
                                                alt={item.Name}
                                                className="minicart-item-thumb"
                                                loading="lazy"
                                            />
                                            <div className="minicart-item-info">
                                                <div>
                                                    <Link
                                                        to={`/product/${item.ProductId}`}
                                                        className="minicart-item-title"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        {item.Name}
                                                    </Link>
                                                    <div className="minicart-item-price">
                                                        ₹{(item.Price || 0).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="minicart-item-actions">
                                                    {/* Quantity Stepper */}
                                                    <div className="minicart-stepper">
                                                        <button
                                                            className="minicart-step-btn"
                                                            onClick={() => updateCartQty(index, -1)}
                                                            disabled={item.Quantity <= 1}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </button>
                                                        <span className="minicart-step-val">{item.Quantity}</span>
                                                        <button
                                                            className="minicart-step-btn"
                                                            onClick={() => updateCartQty(index, 1)}
                                                            aria-label="Increase quantity"
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        className="minicart-remove-btn"
                                                        onClick={() => removeCartItem(item._id)}
                                                        title="Remove item"
                                                        aria-label={`Remove ${item.Name} from cart`}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="minicart-footer">
                                <div className="minicart-summary-row">
                                    <span>Subtotal</span>
                                    <span className="minicart-summary-total">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="minicart-summary-row small mb-3">
                                    <span>Shipping</span>
                                    <span>{progressPercentage >= 100 ? <strong className="text-success">FREE</strong> : 'Calculated at checkout'}</span>
                                </div>

                                <button
                                    className="minicart-btn-checkout"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout <i className="bi bi-arrow-right"></i>
                                </button>

                                <button
                                    className="minicart-btn-cart"
                                    onClick={handleViewFullCart}
                                >
                                    View Full Cart Page
                                </button>

                                <div className="minicart-trust-badges">
                                    <div className="minicart-trust-item">
                                        <i className="bi bi-shield-lock-fill text-success"></i> 256-Bit SSL
                                    </div>
                                    <div className="minicart-trust-item">
                                        <i className="bi bi-arrow-repeat text-primary"></i> 7-Day Returns
                                    </div>
                                    <div className="minicart-trust-item">
                                        <i className="bi bi-lightning-charge-fill text-warning"></i> Fast Dispatch
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default MiniCartDrawer;
