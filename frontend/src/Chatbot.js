import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from './usecontext';
import { API_BASE } from './apiConfig';
import './Chatbot.css';

// Helper to format timestamp
const formatCurrentTime = () => {
  const d = new Date();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// Simple safe markdown-like renderer for bot text
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');
  const renderedElements = [];

  lines.forEach((line, index) => {
    let trimmed = line.trim();

    if (!trimmed) {
      renderedElements.push(<div key={`br-${index}`} style={{ height: '6px' }} />);
      return;
    }

    // Parse bold **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const lineContent = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Check for bullet points
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const cleanBullet = trimmed.replace(/^[\s•\-\*]+\s*/, '');
      const bulletParts = cleanBullet.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      renderedElements.push(
        <div key={`bullet-${index}`} style={{ display: 'flex', gap: '6px', marginLeft: '4px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--chat-primary)', fontWeight: 'bold' }}>•</span>
          <span>{bulletParts}</span>
        </div>
      );
    } else {
      renderedElements.push(
        <p key={`line-${index}`} style={{ margin: '0 0 6px 0' }}>
          {lineContent}
        </p>
      );
    }
  });

  return <div className="chatbot-formatted-text">{renderedElements}</div>;
};

export const Chatbot = () => {
  const { id: userId, addToCartGlobal } = useContext(Context);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addingCartId, setAddingCartId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  const [suggestions, setSuggestions] = useState([
    { id: 1, icon: '💻', text: 'Best laptops for work & gaming' },
    { id: 2, icon: '📱', text: 'Show me top smartphones' },
    { id: 3, icon: '🔥', text: 'What is on sale right now?' },
    { id: 4, icon: '🎧', text: 'Recommend wireless AirPods' },
    { id: 5, icon: '📦', text: 'Where is my order?' },
    { id: 6, icon: '🛡️', text: 'What is your warranty & return policy?' }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Hi there! I'm **ElectroBot**, your AI shopping assistant powered by live store catalog intelligence.\n\nAsk me anything about our laptops, phones, deals, specifications, or your orders!",
      time: formatCurrentTime(),
      products: []
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  // Fetch suggestions from backend on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/suggestions`);
        if (res.ok) {
          const data = await res.json();
          if (data.statuscode === 1 && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          }
        }
      } catch (err) {
        // Silently fallback to default suggestions
      }
    };
    fetchSuggestions();
  }, []);

  // Send message
  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: formatCurrentTime()
    };

    // Update conversation state immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for backend
      const history = updatedMessages.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          history,
          userId: userId || null
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();

      if (data.statuscode === 1) {
        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'I found some matching items in our store!',
          products: Array.isArray(data.products) ? data.products : [],
          source: data.source,
          notice: data.notice,
          time: formatCurrentTime()
        };

        setMessages(prev => [...prev, botReply]);
        if (!isOpen) {
          setHasUnread(true);
        }
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "⚠️ Sorry, I encountered a temporary network issue connecting to the AI service. Please try asking again in a moment.",
        time: formatCurrentTime(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle Quick Chip click
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  // Handle Add to Cart from product card
  const handleAddToCart = async (product) => {
    if (!product || !product._id) return;
    setAddingCartId(product._id);
    try {
      if (addToCartGlobal) {
        await addToCartGlobal(product._id, 1);
      }
    } catch (e) {
      console.error('Error adding to cart from chat:', e);
    } finally {
      setTimeout(() => setAddingCartId(null), 1000);
    }
  };

  // View product detail
  const handleViewProduct = (productId) => {
    navigate(`/detail?id=${productId}`);
  };

  // Clear chat conversation
  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "👋 Chat reset! How else can I assist your electronics shopping today?",
        time: formatCurrentTime(),
        products: []
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button Launcher */}
      {!isOpen && (
        <div className="chatbot-launcher-container">
          <button
            className="chatbot-launcher-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Shopping Assistant"
            id="open-chatbot-btn"
          >
            {hasUnread && <span className="chatbot-badge-ping" />}
            <div className="chatbot-launcher-icon">
              {/* Sparkle / AI Bot SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <span className="chatbot-launcher-text">Ask ElectroBot AI</span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`} id="elcto-chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
                <span className="chatbot-avatar-status" />
              </div>
              <div className="chatbot-title-group">
                <h4>ElectroBot AI</h4>
                <div className="chatbot-subtitle">
                  <span>Online</span>
                  <span className="chatbot-rag-pill">RAG Model</span>
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              {/* Clear chat history */}
              <button
                className="chatbot-action-icon-btn"
                onClick={handleClearChat}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              {/* Minimize / Maximize */}
              <button
                className="chatbot-action-icon-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMinimized ? (
                    <polyline points="18 15 12 9 6 15" />
                  ) : (
                    <polyline points="6 9 12 15 18 9" />
                  )}
                </svg>
              </button>

              {/* Close */}
              <button
                className="chatbot-action-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                aria-label="Close Assistant"
                id="close-chatbot-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="chatbot-messages-container">
                {/* Suggestions Prompt Tray */}
                <div className="chatbot-suggestions-tray">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      className="chatbot-chip"
                      onClick={() => handleSuggestionClick(item.text)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>

                {/* Messages Thread */}
                {messages.map((msg) => (
                  <div key={msg.id} className={`chatbot-message-row ${msg.sender}`}>
                    <div className="chatbot-bubble-wrapper">
                      {msg.sender === 'bot' && (
                        <div className="chatbot-bot-avatar-mini" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <circle cx="12" cy="5" r="2" />
                            <path d="M12 7v4" />
                            <line x1="8" y1="16" x2="8.01" y2="16" />
                            <line x1="16" y1="16" x2="16.01" y2="16" />
                          </svg>
                        </div>
                      )}
                      <div className="chatbot-bubble">
                        <FormattedMessage text={msg.text} />

                        {/* Quota / Fallback Notice */}
                        {msg.notice && (
                          <div className="chatbot-badge-notice">
                            <span className="chatbot-notice-icon">ℹ️</span>
                            <span>{msg.notice}</span>
                          </div>
                        )}

                        {/* Interactive Product Cards if returned by RAG */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="chatbot-products-grid">
                            {msg.products.map((p) => {
                              const isAdded = addingCartId === p._id;
                              const isOutOfStock = p.Stock !== undefined && Number(p.Stock) <= 0;
                              const hasSale = p.OnSale && p.SalePrice;
                              const discountPercent = hasSale && p.ProductPrice > p.SalePrice
                                ? Math.round(((p.ProductPrice - p.SalePrice) / p.ProductPrice) * 100)
                                : null;

                              return (
                                <div key={p._id} className="chatbot-product-card">
                                  <div className="chatbot-product-img-wrapper" onClick={() => handleViewProduct(p._id)}>
                                    {p.Img ? (
                                      <img
                                        src={p.Img}
                                        alt={p.ProductName}
                                        className="chatbot-product-img"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <span style={{ fontSize: '20px' }}>⚡</span>
                                    )}
                                    {discountPercent && (
                                      <span className="chatbot-discount-badge">-{discountPercent}%</span>
                                    )}
                                  </div>

                                  <div className="chatbot-product-info">
                                    <div className="chatbot-product-header-row">
                                      <span className="chatbot-product-brand-tag">{p.BrandName || 'Electronics'}</span>
                                      <span className={`chatbot-product-stock-tag ${isOutOfStock ? 'out' : 'in'}`}>
                                        {isOutOfStock ? 'Out of stock' : 'In stock'}
                                      </span>
                                    </div>

                                    <h5
                                      className="chatbot-product-title"
                                      onClick={() => handleViewProduct(p._id)}
                                      title={p.ProductName}
                                    >
                                      {p.ProductName}
                                    </h5>

                                    <div className="chatbot-product-meta">
                                      {hasSale ? (
                                        <>
                                          <span className="chatbot-product-saleprice">${p.SalePrice}</span>
                                          <span className="chatbot-product-origprice">${p.ProductPrice}</span>
                                        </>
                                      ) : (
                                        <span className="chatbot-product-price">${p.ProductPrice}</span>
                                      )}
                                    </div>

                                    <div className="chatbot-product-actions">
                                      <button
                                        className="chatbot-btn-cart"
                                        onClick={() => handleAddToCart(p)}
                                        disabled={isOutOfStock || isAdded}
                                      >
                                        {isAdded ? (
                                          <>✓ Added</>
                                        ) : (
                                          <>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                              <circle cx="9" cy="21" r="1" />
                                              <circle cx="20" cy="21" r="1" />
                                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                            Add to Cart
                                          </>
                                        )}
                                      </button>

                                      <button
                                        className="chatbot-btn-view"
                                        onClick={() => handleViewProduct(p._id)}
                                      >
                                        Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="chatbot-message-time">{msg.time}</span>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="chatbot-message-row bot">
                    <div className="chatbot-typing-bubble">
                      <div className="chatbot-dot" />
                      <div className="chatbot-dot" />
                      <div className="chatbot-dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="chatbot-input-area">
                <form
                  className="chatbot-input-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className="chatbot-input-field"
                    placeholder="Ask about laptops, phones, orders..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {input && !isLoading && (
                    <button
                      type="button"
                      className="chatbot-input-clear-btn"
                      onClick={() => setInput('')}
                      aria-label="Clear input"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="chatbot-send-btn"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    id="chatbot-send-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>

                <div className="chatbot-footer-caption">
                  <span>⚡ Powered by Elcto RAG & OpenAI</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
