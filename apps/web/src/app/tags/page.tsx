import Link from 'next/link'
import { StoryTag } from '@/components/Story/StoryTag'
import { getCategories, getCategoryAndTagGroup } from '@/lib/turso'

async function buildTree() {
  const categories = await getCategories()
  const categoryAndTagGroup = await getCategoryAndTagGroup()
  const tree = categories.map((category) => {
    const tagGroups = categoryAndTagGroup.filter(
      (group) => group.category === category
    )

    return {
      category,
      tagGroups,
    }
  })

  return tree
}

export const metadata = {
  title: '태그',
}

async function Page() {
  const tree = await buildTree()

  return (
    <div className="flex flex-col gap-4 p-4">
      {tree.map((entry) => {
        return (
          <div key={entry.category} className="flex flex-col gap-2">
            <h2 className="flex items-center text-lg font-medium">
              #{entry.category}
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.tagGroups.map((group) => {
                return (
                  <StoryTag key={group.tag_group}>
                    <Link href={`/search?tag=${group.tag_group}`}>
                      {group.tag_group}
                    </Link>
                  </StoryTag>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Page
