import { StoryList } from '@/components/Story/StoryList'
import { getItems } from '@/lib/turso'

export const metadata = {
  title: '전체보기',
}

async function Page() {
  const items = await getItems()

  return <StoryList data={items} />
}

export default Page
