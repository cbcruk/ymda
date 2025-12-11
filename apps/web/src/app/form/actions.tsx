import { getFile, getFiles } from '@/lib/fs'
import { updateStoryItem } from '@/lib/turso'

export async function sync() {
  'use server'

  const files = await getFiles()

  for (const file of files) {
    const id = file.name.replace('.txt', '')
    const body = await getFile(id)

    await updateStoryItem({
      id: parseInt(id, 10),
      body,
    })
  }

  return true
}
