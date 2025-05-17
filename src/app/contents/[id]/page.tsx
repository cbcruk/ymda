import { getItemById } from '@/lib/turso'
import { ParamsProps } from '@/types'
import { readFile } from 'fs/promises'
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
  const file = await readFile(`src/contents/${id}.txt`, 'utf-8')

  return (
    <div>
      <div className="p-4 break-words whitespace-pre-wrap leading-6 break-keep">
        {file}
      </div>
    </div>
  )
}
