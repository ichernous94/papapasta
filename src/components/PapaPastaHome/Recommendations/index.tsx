import { Suspense } from 'react';
import DatabaseRecommendations from '@/components/DatabaseRecommendations';
export default function PapaPastaRecommendations() { return <Suspense fallback={<p>Ładowanie menu…</p>}><DatabaseRecommendations restaurantId="papapasta" /></Suspense>; }
