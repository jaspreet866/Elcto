import { useEffect } from 'react';

/**
 * Reusable, lightweight SEO component for React applications.
 * Dynamically updates document title, standard meta tags, Open Graph tags,
 * Twitter Cards, canonical links, and Schema.org JSON-LD structured data.
 */
export const SEO = ({
    title = 'ElectoMart | Modern Electronics & Gadgets Store',
    description = 'Discover top electronics, laptops, smartphones, wearables, headphones, and home gadgets at unbeatable prices on ElectoMart. Fast delivery & 100% genuine products.',
    keywords = 'electronics, online electronics store, buy laptops, smartphones, headphones, smart gadgets, best electronics deals, ElectoMart',
    image = '/logo512.png',
    url = '',
    type = 'website',
    robots = 'index, follow',
    schema = null,
    canonical = ''
}) => {
    useEffect(() => {
        // 1. Update Document Title
        const formattedTitle = title.includes('ElectoMart') ? title : `${title} | ElectoMart`;
        document.title = formattedTitle;

        // Current full URL fallback
        const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://electomart.com');
        const canonicalUrl = canonical || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://electomart.com');
        const absoluteImage = image.startsWith('http')
            ? image
            : (typeof window !== 'undefined' ? `${window.location.origin}${image.startsWith('/') ? image : '/' + image}` : image);

        // Helper to create or update <meta> tags
        const setMetaTag = (attributeName, attributeValue, content) => {
            if (!content) return;
            let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attributeName, attributeValue);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // 2. Standard Meta Tags
        setMetaTag('name', 'description', description);
        setMetaTag('name', 'keywords', keywords);
        setMetaTag('name', 'robots', robots);
        setMetaTag('name', 'author', 'ElectoMart');

        // 3. Open Graph (Facebook, LinkedIn, WhatsApp, Discord)
        setMetaTag('property', 'og:site_name', 'ElectoMart');
        setMetaTag('property', 'og:title', formattedTitle);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:type', type);
        setMetaTag('property', 'og:url', currentUrl);
        setMetaTag('property', 'og:image', absoluteImage);
        setMetaTag('property', 'og:locale', 'en_US');

        // 4. Twitter Cards
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', formattedTitle);
        setMetaTag('name', 'twitter:description', description);
        setMetaTag('name', 'twitter:image', absoluteImage);

        // 5. Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonicalUrl);

        // 6. Schema.org JSON-LD Structured Data
        let schemaScript = document.getElementById('seo-json-ld');
        if (schema) {
            if (!schemaScript) {
                schemaScript = document.createElement('script');
                schemaScript.setAttribute('id', 'seo-json-ld');
                schemaScript.setAttribute('type', 'application/ld+json');
                document.head.appendChild(schemaScript);
            }
            schemaScript.textContent = JSON.stringify(schema);
        } else if (schemaScript) {
            schemaScript.remove();
        }

        return () => {
            // Optional cleanup if component unmounts without replacement
        };
    }, [title, description, keywords, image, url, type, robots, schema, canonical]);

    return null;
};

export default SEO;
