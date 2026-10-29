import VideoHero from '@/components/VideoHero';
import { grilledSteak } from '@/config/papapasta-images';
export default function PapaPastaVideoHero() {
  return <VideoHero videoSrc="/videos/papapasta.mp4" poster={grilledSteak} name="Papa Pasta Pizza Wino Steki" logo={{ src: '/icons/logo_papapasta.svg', width: 319, height: 72 }} action={{ href: '/menu', label: 'ZOBACZ MENU' }} />;
}
