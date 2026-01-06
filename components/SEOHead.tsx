import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords = 'numérologie, oracle, divination, IA, décision, analyse, mystique',
  ogType = 'website',
  ogImage = 'https://life-decoder.vercel.app/og-image.png',
  twitterCard = 'summary_large_image',
  structuredData
}: SEOHeadProps) {

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph (Facebook, LinkedIn)
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', window.location.href, true);
    updateMetaTag('og:site_name', 'Life Decoder', true);

    // Twitter Cards
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');

      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }

      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to avoid memory leaks
    return () => {
      // Meta tags persist, which is fine for SPA navigation
    };
  }, [title, description, keywords, ogType, ogImage, twitterCard, structuredData]);

  return null; // This component doesn't render anything
}
