import { exec } from 'child_process'
import { readdir, readFile, stat } from 'fs/promises'
import { promisify } from 'util'

const execify = promisify(exec)

export async function findItemsByKeyword(keyword: string) {
  const result = await execify(
    `grep -rli '${keyword}' --include="*" ./src/contents`
  )
  const stdout = result.stdout

  return stdout
    .split('\n')
    .map((path) => {
      const matched = path.match(/(\d+)\.txt/)

      if (matched) {
        return parseInt(matched[1], 10)
      }

      return null
    })
    .flatMap((id) => id ?? [])
}

export async function getFile(id: string) {
  const file = await readFile(`src/contents/${id}.txt`, 'utf-8')

  return file
}

export async function getFiles() {
  const entries = await readdir('src/contents', { withFileTypes: true })
  const files = entries.filter((entry) => entry.name !== '.DS_Store')

  return files
}

export async function getFilesWithStat() {
  const entries = await getFiles()
  const files = await Promise.all(
    entries.map(async (entry) => {
      const stats = await stat(`${entry.parentPath}/${entry.name}`)

      return {
        name: entry.name,
        size: stats.size,
      }
    })
  )

  return files
}
