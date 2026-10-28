import Button from '@/components/ui/Button';
import { papaPastaCopy } from '@/config/papapasta';
import ContentSection from '../ContentSection';
import { wineBottles } from '../images';

export default function WineSection() {
  return (
    <ContentSection
      id="wino"
      title="WINO"
      image={wineBottles}
      imageAlt="Butelki wina w restauracji Papa Pasta"
      actions={<Button href="/menu#kartawin" variant="dark">KARTA WIN I ALKOHOLI</Button>}
    >
      {papaPastaCopy.wine.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ContentSection>
  );
}
