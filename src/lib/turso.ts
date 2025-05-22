import { storyListSchema, StorySchema, tagSchema } from '@/schema'
import { createClient } from '@libsql/client'
import { z } from 'zod'

export const client = createClient({
  url: 'file:ymda.db',
})

export async function getItems() {
  const result = await client.execute(`SELECT * FROM stories`)
  const rows = storyListSchema.parse(result.rows)

  return rows.toSorted((a, b) => a.title.localeCompare(b.title))
}

export async function getItemById(id: StorySchema['id']) {
  const result = await client.execute(`SELECT * FROM stories WHERE id = ?`, [
    id,
  ])
  const rows = storyListSchema.parse(result.rows)

  return rows.at(0)
}

export async function getRandomItems() {
  const result = await client.execute(
    `SELECT * FROM stories ORDER BY RANDOM() LIMIT 10`
  )
  const rows = storyListSchema.parse(result.rows)

  return rows
}

export async function getItemsByTag(tag: string) {
  const result = await client.execute(
    `
  SELECT * 
  FROM stories 
  WHERE EXISTS (
    SELECT 1
    FROM json_each(tags)
    WHERE json_each.value = ?
  )`,
    [tag]
  )
  const rows = storyListSchema.parse(result.rows)

  return rows
}

export async function getItemsById(ids: Array<number>) {
  const result = await client.execute(
    `SELECT * FROM stories WHERE id in (${ids.join(',')})`
  )
  const rows = storyListSchema.parse(result.rows)

  return rows
}

export async function insertManyTags(
  data: Record<string, Record<string, Array<string>>>
) {
  const transaction = await client.transaction('write')

  try {
    for (const [category, groups] of Object.entries(data)) {
      for (const [tagGroup, tags] of Object.entries(groups)) {
        for (const tag of tags) {
          await transaction.execute({
            sql: 'INSERT INTO tags (category, tag_group, tag) VALUES (?, ?, ?)',
            args: [category, tagGroup, tag],
          })
        }
      }
    }

    await transaction.commit()
  } finally {
    transaction.close()
  }
}

export async function getCategories() {
  const result = await client.execute('SELECT DISTINCT category FROM tags')
  const rows = z.array(tagSchema.pick({ category: true })).parse(result.rows)

  return rows.map((row) => row.category)
}

export async function getCategoryAndTagGroup() {
  const result = await client.execute(
    'SELECT DISTINCT category, tag_group FROM tags'
  )
  const rows = z
    .array(
      tagSchema.pick({
        category: true,
        tag_group: true,
      })
    )
    .parse(result.rows)

  return rows
}
