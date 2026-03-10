import React from "react";
import { SEO_FAQS, DEFAULT_URL, SITE_NAME } from "../constants";
import { AppView, RedeemCode } from "../types";

interface SchemaProps {
  currentView: AppView;
  selectedCode: RedeemCode | null;
}

export const Schema: React.FC<SchemaProps> = ({ currentView, selectedCode }) => {
  const now = new Date();
  const currentDate = now.toISOString();
  // We explicitly use the current hour to ensure Google sees a "Fresh" modification every time they crawl
  const dateModified = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0).toISOString();

  // LIVE BLOG POSTING SCHEMA - High Authority Signal for Google
  const liveBlogSchema = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: `Free Fire Redeem Code Today (${now.toLocaleDateString("en-US")}): 12+ Working Rewards`,
    description:
      "Live coverage of official Garena Free Fire redeem codes. Instant diamonds, skins, and vouchers verified hourly by our global server nodes.",
    url: DEFAULT_URL,
    coverageStartTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString(),
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: "Jaxon Lee",
      jobTitle: "Lead Rewards Analyst",
      url: DEFAULT_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${DEFAULT_URL}/logo.png`,
      },
    },
    liveBlogUpdate: selectedCode
      ? [
          {
            "@type": "BlogPosting",
            headline: `New Code Verified: ${selectedCode.code}`,
            articleBody: `A new ${selectedCode.reward} code has been verified for the ${selectedCode.server} region.`,
            datePublished: currentDate,
          },
        ]
      : [],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEO_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Free Fire Rewards",
        item: DEFAULT_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Today's Codes",
        item: `${DEFAULT_URL}/#codes`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(liveBlogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
};
