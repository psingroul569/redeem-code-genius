import React from 'react';
import { DEFAULT_URL, SITE_NAME, LEAD_AUTHOR } from '@/constants';
import { AppView, RedeemCode } from '@/types';

interface SchemaProps {
  currentView: AppView;
  selectedCode: RedeemCode | null;
  codes?: RedeemCode[];
  lastSyncIso?: string | null;
}

export const Schema: React.FC<SchemaProps> = ({ currentView, selectedCode, codes = [], lastSyncIso = null }) => {
  const now = new Date();
  const currentDate = now.toISOString();
  // Prefer the actual last sync timestamp; fall back to the top of the current hour.
  const dateModified = lastSyncIso
    ? new Date(lastSyncIso).toISOString()
    : new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0).toISOString();

  const liveBlogSchema = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "headline": `Free Fire Redeem Codes Today (${now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}): Working Rewards`,
    "description": "Live coverage of official Garena Free Fire redeem codes. Instant diamonds, skins, and vouchers verified hourly by our global server nodes.",
    "url": DEFAULT_URL,
    "coverageStartTime": new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString(),
    "datePublished": new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString(),
    "dateModified": dateModified,
    "author": { "@type": "Person", "name": LEAD_AUTHOR.name, "jobTitle": LEAD_AUTHOR.role, "url": `${DEFAULT_URL}/about-us` },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "logo": { "@type": "ImageObject", "url": `${DEFAULT_URL}/logo.png`, "width": 512, "height": 512 } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": DEFAULT_URL },
    "liveBlogUpdate": selectedCode ? [{ "@type": "BlogPosting", "headline": `New Code Verified: ${selectedCode.code}`, "articleBody": `A new ${selectedCode.reward} code has been verified for the ${selectedCode.server} region.`, "datePublished": currentDate }] : []
  };

  // Article schema with dynamic dateModified - freshness signal for Googlebot + AI crawlers
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Free Fire Redeem Codes Today - Working Codes",
    "url": DEFAULT_URL,
    "datePublished": "2023-01-01T00:00:00Z",
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": LEAD_AUTHOR.name,
      "jobTitle": LEAD_AUTHOR.role,
      "url": `${DEFAULT_URL}/about-us`,
      "sameAs": ["https://x.com/FalconFF_Real"]
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${DEFAULT_URL}/logo.png`,
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": DEFAULT_URL }
  };

  // ItemList schema for live codes - makes code content visible to crawlers
  const realCodes = (codes || []).filter(c => c && c.code && c.code !== '????????????').slice(0, 20);
  const itemListSchema = realCodes.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Free Fire Redeem Codes Today",
    "numberOfItems": realCodes.length,
    "itemListElement": realCodes.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": c.code,
      "description": `${c.reward} (${c.server} region) - status: ${c.status}.`,
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(liveBlogSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
    </>
  );
};
