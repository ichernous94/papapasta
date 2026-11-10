import { Suspense } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { publicPromotionPopup } from '@/server/content/site-public';
import PromotionalPopup from '@/components/PromotionalPopup';

async function Content() {
  let popup: Awaited<ReturnType<typeof publicPromotionPopup>> = null;
  try {
    popup = await publicPromotionPopup();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
  return popup ? <PromotionalPopup popup={popup}/> : null;
}
export default function DatabasePromotionalPopup() {
  return <Suspense fallback={<span data-popup-loading hidden/>}><Content/></Suspense>;
}
