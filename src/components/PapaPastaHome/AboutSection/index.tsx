import { papaPastaCopy } from '@/config/papapasta';
import ContentSection from '../ContentSection';
import { diningExperience } from '../images';

export default function AboutSection() {
  return (
    <ContentSection id="o-nas" title="O NAS" image={diningExperience} imageAlt="Wspólne jedzenie i wino w restauracji Papa Pasta">
      <p>{papaPastaCopy.about}</p>
    </ContentSection>
  );
}
