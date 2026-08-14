import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageModal.css';

export const ImageModal = ({ isOpen, onClose, imgSrc, title, price, salePrice }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto';
            setIsZoomed(false);
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="image-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="image-modal-container"
                        initial={{ scale: 0.85, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header controls */}
                        <div className="image-modal-header">
                            <div className="image-modal-title">
                                {title && <h5>{title}</h5>}
                                {(price || salePrice) && (
                                    <div className="image-modal-price">
                                        {price && Number(price) > 0 && (
                                            <span className="text-decoration-line-through me-2 text-muted">₹{price}</span>
                                        )}
                                        {salePrice && Number(salePrice) > 0 && (
                                            <span className="text-success fw-bold">₹{salePrice}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="image-modal-actions">
                                <button
                                    type="button"
                                    className="modal-action-btn"
                                    onClick={() => setIsZoomed(!isZoomed)}
                                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                                >
                                    <i className={`bi ${isZoomed ? 'bi-zoom-out' : 'bi-zoom-in'}`}></i>
                                </button>
                                <button
                                    type="button"
                                    className="modal-action-btn close-btn"
                                    onClick={onClose}
                                    title="Close (Esc)"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                        </div>

                        {/* Image body */}
                        <div className={`image-modal-body ${isZoomed ? 'zoomed' : ''}`} onClick={() => setIsZoomed(!isZoomed)}>
                            <motion.img
                                src={imgSrc}
                                alt={title || "Product preview"}
                                className="image-modal-img"
                                animate={{ scale: isZoomed ? 1.7 : 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                            />
                        </div>

                        {/* Footer hint */}
                        <div className="image-modal-footer">
                            <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                {isZoomed ? "Click image to reset zoom" : "Click image to zoom in • Press ESC or click outside to close"}
                            </small>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;
