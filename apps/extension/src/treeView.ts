import * as vscode from 'vscode'
import * as db from './db'

type TreeItem = AuthorItem | StoryItem

export class StoryTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: TreeItem): TreeItem[] {
    if (!db.isOpen()) {
      return []
    }

    if (!element) {
      const authors = db.getAuthors()
      return authors.map((a) => new AuthorItem(a.author, a.count))
    }

    if (element instanceof AuthorItem) {
      const stories = db.getStoriesByAuthor(element.authorName)
      return stories.map((s) => new StoryItem(s))
    }

    return []
  }
}

export class AuthorItem extends vscode.TreeItem {
  constructor(
    public readonly authorName: string,
    public readonly count: number
  ) {
    super(authorName, vscode.TreeItemCollapsibleState.Collapsed)

    this.description = `${count}편`
    this.iconPath = new vscode.ThemeIcon('person')
    this.contextValue = 'author'
  }
}

export class StoryItem extends vscode.TreeItem {
  constructor(public readonly story: db.Story) {
    super(story.title, vscode.TreeItemCollapsibleState.None)

    this.description = (() => {
      const sizeKB = (story.size / 1000).toFixed(1)
      return `${sizeKB}KB`
    })()
    this.tooltip = story.summary || story.title
    this.iconPath = new vscode.ThemeIcon('file-text')
    this.contextValue = 'story'

    this.command = {
      command: 'ymda.openStory',
      title: '소설 열기',
      arguments: [story],
    }
  }
}
