import Recommendations from '@/components/Recommendations';
import { publicMenu } from '@/server/content/public';
export default async function DatabaseRecommendations({ restaurantId }: {
    restaurantId: 'papapasta' | 'centro';
}) {
    const menu = await publicMenu(restaurantId, 'recommendations');
    const items = menu.categories.flatMap(c => c.groups.flatMap(g => g.items)).map(i => ({ id: i.id, name: i.name, weight: i.portion, description: i.description.join('\n'), price: i.price, image: i.image }));
    return <Recommendations restaurantId={restaurantId} items={items} title={menu.title} subtitle={menu.subtitle} variant={restaurantId === 'centro' ? 'light' : 'dark'}/>;
}
