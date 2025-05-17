import { StoryList } from '@/components/Story/StoryList'
import { getItemsByTag } from '@/lib/turso'
import { SearchParamsProps } from '@/types'
import { Metadata } from 'next'

type PageProps = SearchParamsProps<{
  tag: string
  q: string
}>

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { tag } = await searchParams

  return {
    title: `#${tag}`,
  }
}

async function Page({ searchParams }: PageProps) {
  const { tag = '' } = await searchParams
  const items = await getItemsByTag(tag)

  return <StoryList data={items} />
}

export default Page
