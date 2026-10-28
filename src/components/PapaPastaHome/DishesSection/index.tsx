import Button from '@/components/ui/Button';
import { papaPasta, papaPastaCopy } from '@/config/papapasta';
import ContentSection from '../ContentSection';
import Reservation from '../Reservation';
import { grilledSteak } from '../images';

export default function DishesSection() {
  return (
    <ContentSection
      id="nasze-potrawy"
      title="NASZE POTRAWY"
      image={grilledSteak}
      imageAlt="Grillowany stek podany na desce"
      imageSide="left"
      actions={<>
        <Button href={papaPasta.orderUrl} variant="dark">ZAMÓW Z DOSTAWĄ</Button>
        <Reservation />
      </>}
    >
      {papaPastaCopy.dishes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ContentSection>
  );
}
