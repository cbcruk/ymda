import * as vscode from 'vscode'
import * as db from './db'
import { StoryTreeProvider } from './treeView'
import {
  StoryContentProvider,
  STORY_SCHEME,
  createStoryUri,
} from './storyProvider'

let treeProvider: StoryTreeProvider

export async function activate(context: vscode.ExtensionContext) {
  console.log('ymda 확장 활성화됨')

  const storyProvider = new StoryContentProvider()

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      STORY_SCHEME,
      storyProvider
    )
  )

  treeProvider = new StoryTreeProvider()

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('ymdaExplorer', treeProvider)
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('ymda.openDatabase', async () => {
      const uri = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          'SQLite Database': ['db', 'sqlite', 'sqlite3'],
          'All Files': ['*'],
        },
        title: '소설 데이터베이스 선택',
      })

      if (uri && uri[0]) {
        try {
          await db.openDatabase(uri[0].fsPath)

          await vscode.workspace
            .getConfiguration('ymda')
            .update(
              'databasePath',
              uri[0].fsPath,
              vscode.ConfigurationTarget.Global
            )

          treeProvider.refresh()
          vscode.window.showInformationMessage(
            `데이터베이스 열림: ${uri[0].fsPath}`
          )
        } catch (err) {
          vscode.window.showErrorMessage(`데이터베이스 열기 실패: ${err}`)
        }
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('ymda.browseStories', async () => {
      if (!db.isOpen()) {
        const action = await vscode.window.showWarningMessage(
          '데이터베이스가 열려있지 않습니다.',
          '데이터베이스 열기'
        )

        if (action === '데이터베이스 열기') {
          await vscode.commands.executeCommand('ymda.openDatabase')
        }

        return
      }

      const stories = db.getStories()

      const items = stories.map((story) => ({
        label: `$(file-text) ${story.title}`,
        description: story.author,
        detail: story.summary || undefined,
        story,
      }))

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '소설을 선택하세요',
        matchOnDescription: true,
        matchOnDetail: true,
      })

      if (selected) {
        await openStory(selected.story)
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('ymda.searchStories', async () => {
      if (!db.isOpen()) {
        vscode.window.showWarningMessage('데이터베이스가 열려있지 않습니다.')
        return
      }

      const query = await vscode.window.showInputBox({
        prompt: '검색어를 입력하세요',
        placeHolder: '제목, 작가, 또는 요약에서 검색',
      })

      if (!query) return

      const stories = db.searchStories(query)

      if (stories.length === 0) {
        vscode.window.showInformationMessage('검색 결과가 없습니다.')
        return
      }

      const items = stories.map((story) => ({
        label: `$(file-text) ${story.title}`,
        description: story.author,
        detail: story.summary || undefined,
        story,
      }))

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: `"${query}" 검색 결과: ${stories.length}건`,
        matchOnDescription: true,
        matchOnDetail: true,
      })

      if (selected) {
        await openStory(selected.story)
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ymda.openStory',
      async (story: db.Story) => {
        await openStory(story)
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('ymda.refresh', () => {
      treeProvider.refresh()
    })
  )

  const savedPath = vscode.workspace
    .getConfiguration('ymda')
    .get<string>('databasePath')

  if (savedPath) {
    try {
      await db.openDatabase(savedPath)
      treeProvider.refresh()
    } catch (err) {
      console.error('저장된 DB 경로 열기 실패:', err)
    }
  }
}

async function openStory(story: db.Story) {
  const uri = createStoryUri(story)

  try {
    const doc = await vscode.workspace.openTextDocument(uri)

    await vscode.window.showTextDocument(doc, {
      preview: false,
      viewColumn: vscode.ViewColumn.One,
    })
  } catch (err) {
    vscode.window.showErrorMessage(`소설 열기 실패: ${err}`)
  }
}

export function deactivate() {
  db.closeDatabase()
}
