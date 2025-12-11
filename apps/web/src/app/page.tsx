import { StoryList } from '@/components/Story/StoryList'
import { getRandomItems } from '@/lib/turso'

export default async function Home() {
  const items = await getRandomItems()

  return <StoryList data={items} />
}
