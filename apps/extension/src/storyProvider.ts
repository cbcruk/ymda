import * as vscode from 'vscode'
import * as db from './db'

export const STORY_SCHEME = 'story'

export function createStoryUri(story: db.Story): vscode.Uri {
  return vscode.Uri.parse(
    `${STORY_SCHEME}:${encodeURIComponent(story.author)}/${encodeURIComponent(
      story.title
    )}.md?id=${story.id}`
  )
}

export class StoryContentProvider
  implements vscode.TextDocumentContentProvider
{
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
  readonly onDidChange = this._onDidChange.event

  provideTextDocumentContent(uri: vscode.Uri): string {
    const id = this.parseStoryId(uri)

    if (id === null) {
      return '# 오류\n\n소설 ID를 찾을 수 없습니다.'
    }

    const body = db.getStoryBody(id)

    if (!body) {
      return '# 오류\n\n소설 본문을 찾을 수 없습니다.'
    }

    return body
  }

  private parseStoryId(uri: vscode.Uri): number | null {
    const params = new URLSearchParams(uri.query)
    const id = params.get('id')

    return id ? parseInt(id, 10) : null
  }

  refresh(uri: vscode.Uri): void {
    this._onDidChange.fire(uri)
  }
}
