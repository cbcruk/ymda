import initSqlJs, { Database } from 'sql.js'
import * as fs from 'fs'

export interface Story {
  id: number
  title: string
  author: string
  size: number
  summary: string
}

export interface StoryBody {
  id: number
  body: string
}

export interface Author {
  author: string
  count: number
}

let db: Database | null = null

export async function openDatabase(dbPath: string): Promise<void> {
  if (db) {
    db.close()
  }

  const SQL = await initSqlJs()
  const buffer = fs.readFileSync(dbPath)

  db = new SQL.Database(buffer)
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}

export function isOpen(): boolean {
  return db !== null
}

export function getStories(): Story[] {
  if (!db) return []

  const result = db.exec(`
    SELECT id, title, author, size, summary
    FROM stories
    ORDER BY author, title
  `)

  if (result.length === 0) return []

  return result[0].values.map((row) => ({
    id: row[0] as number,
    title: row[1] as string,
    author: row[2] as string,
    size: (row[3] as number) || 0,
    summary: (row[4] as string) || '',
  }))
}

export function getAuthors(): Author[] {
  if (!db) return []

  const result = db.exec(`
    SELECT author, COUNT(*) as count
    FROM stories
    GROUP BY author
    ORDER BY author
  `)

  if (result.length === 0) return []

  return result[0].values.map((row) => ({
    author: row[0] as string,
    count: row[1] as number,
  }))
}

export function getStoriesByAuthor(author: string): Story[] {
  if (!db) return []

  const stmt = db.prepare(`
    SELECT id, title, author, size, summary
    FROM stories
    WHERE author = ?
    ORDER BY title
  `)
  stmt.bind([author])

  const stories: Story[] = []

  while (stmt.step()) {
    const row = stmt.get()

    stories.push({
      id: row[0] as number,
      title: row[1] as string,
      author: row[2] as string,
      size: (row[3] as number) || 0,
      summary: (row[4] as string) || '',
    })
  }

  stmt.free()

  return stories
}

export function getStoryBody(id: number): string | null {
  if (!db) return null

  const stmt = db.prepare('SELECT body FROM story WHERE id = ?')

  stmt.bind([id])

  if (stmt.step()) {
    const row = stmt.get()
    stmt.free()
    return row[0] as string
  }

  stmt.free()

  return null
}

export function searchStories(query: string): Story[] {
  if (!db) return []

  const term = `%${query}%`
  const stmt = db.prepare(`
    SELECT id, title, author, size, summary
    FROM stories
    WHERE title LIKE ? OR author LIKE ? OR summary LIKE ?
    ORDER BY author, title
  `)

  stmt.bind([term, term, term])

  const stories: Story[] = []

  while (stmt.step()) {
    const row = stmt.get()

    stories.push({
      id: row[0] as number,
      title: row[1] as string,
      author: row[2] as string,
      size: (row[3] as number) || 0,
      summary: (row[4] as string) || '',
    })
  }

  stmt.free()

  return stories
}
