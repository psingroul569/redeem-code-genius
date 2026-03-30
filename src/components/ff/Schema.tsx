import React from 'react';
import { SEO_FAQS, DEFAULT_URL, SITE_NAME, LEAD_AUTHOR } from '@/constants';
import { AppView, RedeemCode } from '@/types';

interface SchemaProps {
  currentView: AppView;
  selectedCode: RedeemCode | null;
}

export const Schema: React.FC<SchemaProps> = ({ currentView, selectedCode }) => {
  const now = new Date();
  const currentDate = now.toISOString();
  const dateModified = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0).toISOString();

  const liveBlogSchema = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "headline": `Free Fire Redeem Code Today (${now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}): 12+ Working Rewards`,
    "description": "Live coverage of official Garena Free Fire redeem codes. Instant diamonds, skins, and vouchers verified hourly by our global server nodes.",
    "url": DEFAULT_URL,
    "coverageStartTime": new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString(),
    "datePublished": new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString(),
    "dateModified": dateModified,
    "author": { "@type": "Person", "name": LEAD_AUTHOR.name, "jobTitle": LEAD_AUTHOR.role, "url": DEFAULT_URL },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "logo": { "@type": "ImageObject", "url": `${DEFAULT_URL}/logo.png` } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": DEFAULT_URL },
    "liveBlogUpdate": selectedCode ? [{ "@type": "BlogPosting", "headline": `New Code Verified: ${selectedCode.code}`, "articleBody": `A new ${selectedCode.reward} code has been verified for the ${selectedCode.server} region.`, "datePublished": currentDate }] : []
  };


  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DEFAULT_URL },
      { "@type": "ListItem", "position": 2, "name": "Free Fire Redeem Codes Today", "item": `${DEFAULT_URL}/#codes` }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": DEFAULT_URL,
    "description": "Get the latest working Free Fire redeem codes updated hourly. Free diamonds, skins, and bundles verified from official Garena servers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${DEFAULT_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": DEFAULT_URL,
    "logo": `${DEFAULT_URL}/logo.png`,
    "sameAs": [
      "https://x.com/FalconFF_Real"
    ],
    "founder": {
      "@type": "Person",
      "name": LEAD_AUTHOR.name,
      "jobTitle": LEAD_AUTHOR.role,
      "description": LEAD_AUTHOR.bio,
      "image": LEAD_AUTHOR.image,
      "sameAs": ["https://x.com/FalconFF_Real"]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": ["English", "Hindi", "Portuguese", "Indonesian"]
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(liveBlogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
    </>
  );
};
