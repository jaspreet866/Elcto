const OpenAI = require('openai');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Order = require('../models/Order');

// Initialize OpenAI client
let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    } catch (e) {
        console.warn('Failed to initialize OpenAI client:', e.message);
    }
}

/**
 * Static Store Knowledge Base
 */
const STORE_INFO = {
    storeName: "Elcto Electronics",
    supportEmail: "support@elcto.com",
    shipping: "Free standard shipping on orders over $50. Express shipping delivered within 2-3 business days.",
    returns: "Hassle-free 30-day return policy for unopened and undamaged items in original packaging.",
    warranty: "1-year standard manufacturer warranty on all certified brand-new electronics.",
    payments: "We accept Visa, MasterCard, American Express, PayPal, and Cash on Delivery (COD).",
    discounts: "Check our 'On Sale' section for up to 40% discount on selected laptops, smartphones, and accessories."
};

/**
 * Extract search keywords and parameters from user input
 */
function parseUserQuery(query) {
    const text = (query || "").toLowerCase();

    // Check for budget / price constraints (e.g. "under 500", "under $1000", "< 500")
    const priceMatch = text.match(/(?:under|below|less than|\<)\s*\$?(\d+(?:\.\d+)?)/i);
    const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Check for on-sale / discounts
    const isSaleQuery = /sale|discount|deal|offer|cheapest|cheap|bargain/i.test(text);

    // Check for order queries
    const isOrderQuery = /order|tracking|track|delivery|status|where is my/i.test(text);

    // Check for policy / support queries
    const isPolicyQuery = /return|shipping|refund|warranty|support|contact|policy|pay/i.test(text);

    return {
        maxPrice,
        isSaleQuery,
        isOrderQuery,
        isPolicyQuery,
        cleanQuery: text.replace(/[^\w\s]/gi, ' ').trim()
    };
}

/**
 * Retrieve relevant products and data from MongoDB (The "Retrieval" in RAG)
 */
async function retrieveContext(userQuery, userId = null) {
    const parsed = parseUserQuery(userQuery);
    let matchedProducts = [];
    let userOrders = [];
    let categories = [];
    let brands = [];

    try {
        // Fetch categories and brands for entity matching
        [categories, brands] = await Promise.all([
            Category.find().lean().exec().catch(() => []),
            Brand.find().lean().exec().catch(() => [])
        ]);

        // If user is inquiring about orders and is logged in
        if (parsed.isOrderQuery && userId) {
            userOrders = await Order.find({ UserId: userId }).sort({ _id: -1 }).limit(3).lean().exec().catch(() => []);
        }

        // Build product query filter
        const orConditions = [];
        const words = parsed.cleanQuery
            .split(/\s+/)
            .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'show', 'give', 'what', 'have', 'best', 'good', 'some', 'want', 'need', 'like', 'this', 'that', 'under', 'below'].includes(w));

        // Category matches
        const matchedCategoryIds = categories
            .filter(c => c.Name && words.some(w => c.Name.toLowerCase().includes(w)))
            .map(c => c._id.toString());

        // Brand matches
        const matchedBrandIds = brands
            .filter(b => b.BrandName && words.some(w => b.BrandName.toLowerCase().includes(w)))
            .map(b => b._id.toString());

        if (matchedCategoryIds.length > 0) {
            orConditions.push({ Category: { $in: matchedCategoryIds } });
        }
        if (matchedBrandIds.length > 0) {
            orConditions.push({ Brand: { $in: matchedBrandIds } });
        }

        for (const word of words) {
            const regex = new RegExp(word, 'i');
            orConditions.push({ ProductName: regex });
            orConditions.push({ Brand: regex });
            orConditions.push({ Specifications: regex });
            orConditions.push({ ProductDetail: regex });
        }

        const mongoFilter = {};
        if (orConditions.length > 0) {
            mongoFilter.$or = orConditions;
        }

        if (parsed.isSaleQuery) {
            mongoFilter.OnSale = { $in: [true, 'true', '1', 'yes'] };
        }

        if (parsed.maxPrice) {
            mongoFilter.ProductPrice = { $lte: parsed.maxPrice };
        }

        // Execute product search
        matchedProducts = await Product.find(mongoFilter)
            .limit(6)
            .lean()
            .exec()
            .catch(() => []);

        // If no products matched the specific filter, fetch general top / featured products
        if (matchedProducts.length === 0 && !parsed.isOrderQuery && !parsed.isPolicyQuery) {
            matchedProducts = await Product.find()
                .sort({ _id: -1 })
                .limit(4)
                .lean()
                .exec()
                .catch(() => []);
        }

        // Map Brand and Category ObjectIds to human-readable names
        const brandMap = new Map(brands.map(b => [b._id ? b._id.toString() : '', b.BrandName]));
        const categoryMap = new Map(categories.map(c => [c._id ? c._id.toString() : '', c.Name]));

        matchedProducts = matchedProducts.map(p => ({
            ...p,
            BrandName: (p.Brand && brandMap.get(String(p.Brand))) || p.Brand || 'Elcto Certified',
            CategoryName: (p.Category && categoryMap.get(String(p.Category))) || p.Category || 'Electronics'
        }));
    } catch (err) {
        console.error('Error during RAG context retrieval:', err);
    }

    return {
        products: matchedProducts,
        orders: userOrders,
        categories,
        brands,
        parsed
    };
}

/**
 * Format context text for LLM injection
 */
function buildAugmentedPrompt(userMessage, context) {
    const { products, orders, parsed } = context;

    let contextSection = `=== LIVE ELCTO STORE CATALOG CONTEXT ===\n`;

    if (products && products.length > 0) {
        contextSection += `AVAILABLE MATCHING PRODUCTS IN STORE (${products.length} found):\n`;
        products.forEach((p, idx) => {
            const price = p.SalePrice && p.OnSale ? `$${p.SalePrice} (Discounted from $${p.ProductPrice})` : `$${p.ProductPrice || 'Contact us'}`;
            const inStock = p.Stock > 0 ? `In Stock (${p.Stock} units)` : 'Out of Stock';
            contextSection += `${idx + 1}. [ID: ${p._id}] "${p.ProductName}" - Brand: ${p.BrandName || p.Brand || 'N/A'}, Category: ${p.CategoryName || 'N/A'}, Price: ${price}, Status: ${inStock}\n`;
            if (p.Specifications) contextSection += `   Specifications: ${p.Specifications}\n`;
            if (p.ProductDetail) contextSection += `   Overview: ${p.ProductDetail.slice(0, 160)}...\n`;
        });
    } else {
        contextSection += `No exact matching products found in the catalog right now.\n`;
    }

    if (orders && orders.length > 0) {
        contextSection += `\nCUSTOMER'S RECENT ORDERS:\n`;
        orders.forEach((ord, i) => {
            contextSection += `Order #${ord.OrderNo || ord._id}: Date: ${ord.Date || 'Recent'}, Total: $${ord.Total}, Payment: ${ord.Payment || 'N/A'}\n`;
            if (Array.isArray(ord.Order)) {
                ord.Order.forEach(item => {
                    contextSection += `   - ${item.ProductName} (Qty: ${item.Quantity}, Price: $${item.Price})\n`;
                });
            }
        });
    }

    contextSection += `\nSTORE POLICIES & INFO:\n`;
    contextSection += `- Shipping: ${STORE_INFO.shipping}\n`;
    contextSection += `- Returns: ${STORE_INFO.returns}\n`;
    contextSection += `- Warranty: ${STORE_INFO.warranty}\n`;
    contextSection += `- Support: ${STORE_INFO.supportEmail}\n`;
    contextSection += `- Payments: ${STORE_INFO.payments}\n`;
    contextSection += `=== END CATALOG CONTEXT ===\n`;

    return contextSection;
}

/**
 * Intelligent Fallback Generator
 * Generates helpful grounded responses when OpenAI API quota is exhausted
 */
function generateFallbackResponse(userMessage, context) {
    const { products, orders, parsed } = context;
    const lower = userMessage.toLowerCase();

    // Order status inquiry
    if (parsed.isOrderQuery) {
        if (orders && orders.length > 0) {
            const latest = orders[0];
            const items = (latest.Order || []).map(i => `${i.ProductName} (x${i.Quantity})`).join(', ');
            return {
                reply: `📦 **Your Recent Order Details:**\n\n• **Order ID**: #${latest.OrderNo || latest._id}\n• **Date**: ${latest.Date || 'Recent'}\n• **Items**: ${items || 'Standard Electronics'}\n• **Total**: $${latest.Total}\n• **Payment**: ${latest.Payment || 'Processed'}\n\nYour order is currently being prepared for dispatch! You can check your account dashboard for tracking updates.`,
                products: [],
                quotaExhausted: true
            };
        } else {
            return {
                reply: `📦 To check your order status, please make sure you are logged into your Elcto account, or visit the **Profile / Orders** page from the top navigation menu. If you need urgent assistance with an order ID, contact our support team at **support@elcto.com**.`,
                products: [],
                quotaExhausted: true
            };
        }
    }

    // Policies inquiry
    if (parsed.isPolicyQuery) {
        let policyReply = `Here is our official **Elcto Store Information**:\n\n`;
        if (lower.includes('return') || lower.includes('refund')) {
            policyReply += `🔄 **Return & Refund Policy**: ${STORE_INFO.returns}\n\n`;
        }
        if (lower.includes('ship') || lower.includes('delivery')) {
            policyReply += `🚚 **Shipping Information**: ${STORE_INFO.shipping}\n\n`;
        }
        if (lower.includes('warranty')) {
            policyReply += `🛡️ **Warranty Guarantee**: ${STORE_INFO.warranty}\n\n`;
        }
        if (lower.includes('pay') || lower.includes('method')) {
            policyReply += `💳 **Payment Methods**: ${STORE_INFO.payments}\n\n`;
        }
        policyReply += `💬 Need more help? Contact our 24/7 support at **${STORE_INFO.supportEmail}**.`;
        return {
            reply: policyReply,
            products: [],
            quotaExhausted: true
        };
    }

    // Product search / recommendations
    if (products && products.length > 0) {
        let intro = `Here are the best matching items from our live catalog:`;
        if (parsed.isSaleQuery) {
            intro = `🔥 Here are top deals and discounted products currently available:`;
        } else if (parsed.maxPrice) {
            intro = `💰 Here are great options under $${parsed.maxPrice}:`;
        } else if (lower.includes('laptop')) {
            intro = `💻 Here are top laptops available at Elcto:`;
        } else if (lower.includes('phone') || lower.includes('mobile')) {
            intro = `📱 Here are top smartphones available at Elcto:`;
        }

        let reply = `${intro}\n\n`;
        products.forEach((p, idx) => {
            const price = p.SalePrice && p.OnSale ? `**$${p.SalePrice}** ~~$${p.ProductPrice}~~ (Sale!)` : `**$${p.ProductPrice}**`;
            const stockStatus = p.Stock > 0 ? `✅ In Stock (${p.Stock} available)` : `⚠️ Currently Out of Stock`;
            reply += `${idx + 1}. **${p.ProductName}**\n   - Price: ${price}\n   - Brand: ${p.BrandName || p.Brand || 'Elcto Certified'}\n   - Availability: ${stockStatus}\n`;
            if (p.Specifications) {
                reply += `   - Specs: ${p.Specifications}\n`;
            }
            reply += `\n`;
        });

        reply += `💡 *You can click "Add to Cart" directly on any product card below, or click the title to view full specifications!*`;

        return {
            reply,
            products,
            quotaExhausted: true
        };
    }

    // General greeting or fallback
    return {
        reply: `👋 Hello! I am **ElectroBot**, your AI shopping assistant for Elcto Electronics!\n\nI can help you:\n• 🔍 Find laptops, smartphones, AirPods, and TVs\n• 💰 Discover on-sale deals and budget-friendly gadgets\n• 📦 Check your order status and shipping policies\n• 🛒 Add items directly to your shopping cart\n\nWhat are you looking for today?`,
        products: [],
        quotaExhausted: true
    };
}

/**
 * Main RAG Chat Completion Method
 */
async function processRAGChat({ message, history = [], userId = null }) {
    // 1. Retrieve relevant data from MongoDB
    const context = await retrieveContext(message, userId);

    // 2. Build augmented prompt
    const augmentedContextText = buildAugmentedPrompt(message, context);

    const systemPrompt = `You are ElectroBot, the intelligent, friendly, and expert AI shopping assistant for "Elcto Electronics", an advanced online store selling electronics, gadgets, laptops, smartphones, TVs, and accessories.

YOUR CAPABILITIES & GUIDELINES:
1. Always base your recommendations and product details on the provided LIVE ELCTO STORE CATALOG CONTEXT.
2. Mention product names, exact prices (or sale discounts), specifications, and stock status clearly.
3. Be enthusiastic, polite, concise, and structured (use markdown bullet points and bolding).
4. If the user asks for products that are in the catalog context, highlight their key benefits.
5. If the user asks about store policies (returns, shipping, warranty), answer accurately using the store info.
6. If the user asks about an order and order context is provided, give their order details.
7. Keep responses concise and engaging (under 180 words when possible) so the customer can quickly make a shopping decision.

${augmentedContextText}`;

    // 3. Prepare messages for OpenAI
    const openAiMessages = [
        { role: 'system', content: systemPrompt }
    ];

    // Add recent history for multi-turn context (limit to last 6 turns)
    if (Array.isArray(history)) {
        const recentHistory = history.slice(-6);
        for (const h of recentHistory) {
            if (h.role && h.content) {
                openAiMessages.push({
                    role: h.role === 'user' ? 'user' : 'assistant',
                    content: String(h.content).slice(0, 500)
                });
            }
        }
    }

    // Add current user prompt
    openAiMessages.push({
        role: 'user',
        content: message
    });

    const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // 4. Attempt OpenAI Generation
    if (openai && process.env.OPENAI_API_KEY) {
        try {
            const completion = await openai.chat.completions.create({
                model: modelName,
                messages: openAiMessages,
                temperature: 0.4,
                max_tokens: 600
            });

            const reply = completion.choices?.[0]?.message?.content;
            if (reply) {
                return {
                    reply,
                    products: context.products || [],
                    source: 'openai-rag',
                    model: modelName
                };
            }
        } catch (apiError) {
            console.warn(`OpenAI API failed (${apiError.status || apiError.code || apiError.message}). Using intelligent RAG fallback.`);
            
            // Check if it was a quota exhaustion error
            const isQuota = apiError.status === 429 || 
                            (apiError.error && apiError.error.code === 'credit_balance_exhausted') ||
                            (apiError.message && apiError.message.includes('credit'));

            const fallback = generateFallbackResponse(message, context);
            return {
                reply: fallback.reply,
                products: fallback.products,
                source: isQuota ? 'rag-database-quota-fallback' : 'rag-database-fallback',
                notice: isQuota ? 'OpenAI credits exhausted on API key; serving live database RAG retrieval.' : null
            };
        }
    }

    // If no OpenAI client or key, use fallback
    const fallback = generateFallbackResponse(message, context);
    return {
        reply: fallback.reply,
        products: fallback.products,
        source: 'rag-database-engine'
    };
}

module.exports = {
    processRAGChat,
    retrieveContext,
    STORE_INFO
};
