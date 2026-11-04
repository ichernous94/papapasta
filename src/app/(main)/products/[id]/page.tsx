import { notFound } from 'next/navigation';

// This route belonged to the removed shop template; no restaurant product exists here.
export default function LegacyProductPage() {
  notFound();
}
