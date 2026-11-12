import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import Image from 'next/image';
import PromotionArticleReveal from '../src/components/PromotionArticle/Reveal';
import PromotionArticleSkeleton from '../src/components/PromotionArticle/Skeleton';

test('An article keeps its image, title, date, text and action inside one loading boundary with a no-JS escape', () => {
  const html = renderToStaticMarkup(<PromotionArticleReveal imageSrc="/images/article.webp" imageRatio={2}>
    <Image src="/images/article.webp" alt="Lunch" width={1200} height={600}/>
    <h2>Lunch title</h2><time dateTime="2026-11-12">12 listopada</time><p>Article text</p><a href="tel:883317389">Call</a>
  </PromotionArticleReveal>);
  assert.ok(html.includes('data-article-reveal') && html.includes('data-article-content') && html.includes('data-state="loading"'));
  assert.ok(html.includes('Lunch title') && html.includes('Article text') && html.includes('dateTime="2026-11-12"') && html.includes('href="tel:883317389"'));
  assert.ok(html.includes('--article-image-ratio:2') && html.includes('<noscript>'));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert.ok(!html.includes('background-image:') && !html.includes('data-dish-image'));
});

test('The article data Skeleton announces loading; its image-loading overlay stays decorative', () => {
  const fallback = renderToStaticMarkup(<PromotionArticleSkeleton/>);
  assert.ok(fallback.includes('role="status"') && fallback.includes('aria-busy="true"') && fallback.includes('Ładowanie promocji'));
  assert.ok(fallback.includes('skeletonImage') && fallback.includes('skeletonTitle') && fallback.includes('skeletonDate') && fallback.includes('skeletonParagraph') && fallback.includes('skeletonButton'));
  const overlay = renderToStaticMarkup(<PromotionArticleSkeleton decorative imageRatio={0.75}/>);
  assert.ok(overlay.includes('aria-hidden="true"') && overlay.includes('--article-image-ratio:0.75'));
  assert.ok(!overlay.includes('role="status"') && !overlay.includes('<img'));
});
