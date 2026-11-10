import VideoHero from '@/components/VideoHero';
import poster from '../../../../public/images/video-posters/papapasta.webp';
export default function PapaPastaVideoHero() {
  return <VideoHero videoSrc="/videos/papapasta.mp4" poster={poster} name="Papa Pasta Pizza Wino Steki" logo={{ src: '/icons/logo_papapasta.svg', width: 319, height: 72 }} action={{ href: '/menu', label: 'ZOBACZ MENU' }} />;
}
