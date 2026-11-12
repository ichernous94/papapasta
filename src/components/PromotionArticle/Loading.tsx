import PromotionArticleFrame from './Frame';
import PromotionArticleSkeleton from './Skeleton';

export default function PromotionArticleLoading({ legacy = false }: { legacy?: boolean }) {
  return <PromotionArticleFrame title={legacy ? 'ZESTAWY OBIADOWE' : 'OKAZJE I PROMOCJE'} subtitle={legacy ? 'Więcej smaku za mniej' : 'Okazje i promocje'}>
    <PromotionArticleSkeleton/>
  </PromotionArticleFrame>;
}
