import { StoryViewer } from '@/components/Story/StoryViewer'
import { getItemById, getStoryItem } from '@/lib/turso'
import { ParamsProps } from '@/types'
import { Metadata } from 'next'

type PageProps = ParamsProps<{ id: string }>

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | null> {
  const { id } = await params
  const story = await getItemById(parseInt(id, 10))

  if (!story) {
    return null
  }

  return {
    title: `${story.title}`,
  }
}

export default async function Page({ params }: PageProps) {
  const p = await params
  const id = decodeURIComponent(p.id)
  const file = await getStoryItem(parseInt(id, 10))

  return <StoryViewer>{file.body}</StoryViewer>
}
