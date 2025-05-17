import { StorySchema } from '@/schema'
import Link from 'next/link'
import { StoryReadTimeAndType } from './StoryReadTimeAndType'
import { StoryTag } from './StoryTag'

type ItemsProps = {
  data: Array<StorySchema>
}

export function StoryList({ data }: ItemsProps) {
  return (
    <div className="flex flex-col flex-wrap py-4 gap-6">
      {data.map((item) => {
        return (
          <div key={item.id} className="flex flex-col gap-4 px-4">
            <Link href={`/contents/${item.id}`} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-medium text-lg">{item.title}</h2>
                <StoryReadTimeAndType size={item.size} />
              </div>
              <div className="flex flex-col gap-1">
                <p title={item.keywords.join(', ')} className="text-sm">
                  {item.summary}
                </p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5 text-xs whitespace-nowrap">
                {item.tags.map((tag) => (
                  <StoryTag key={tag}>
                    <Link href={`/search?tag=${tag}`}>#{tag}</Link>
                  </StoryTag>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
