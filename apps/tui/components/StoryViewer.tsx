import { useState, useMemo, use } from 'react'
import { Box, Text, useInput, useStdout } from 'ink'
import { getStoryItem } from '@ymda/shared'

interface Props {
  id: number
  onBack: () => void
}

const storyCache = new Map<
  number,
  Promise<Awaited<ReturnType<typeof getStoryItem>>>
>()

function getStoryPromise(id: number) {
  if (!storyCache.has(id)) {
    storyCache.set(id, getStoryItem(id))
  }

  return storyCache.get(id)!
}

export function StoryViewer({ id, onBack }: Props) {
  const story = use(getStoryPromise(id))
  const [scrollOffset, setScrollOffset] = useState(0)
  const { stdout } = useStdout()

  const terminalHeight = stdout?.rows ?? 24
  const contentHeight = terminalHeight - 4

  const lines = useMemo(() => {
    if (!story?.body) return []

    const terminalWidth = stdout?.columns ?? 80
    const paragraphs = story.body.split('\n')
    const wrapped: string[] = []

    for (const paragraph of paragraphs) {
      if (paragraph.length === 0) {
        wrapped.push('')
        continue
      }

      let remaining = paragraph

      while (remaining.length > 0) {
        wrapped.push(remaining.slice(0, terminalWidth))
        remaining = remaining.slice(terminalWidth)
      }
    }

    return wrapped
  }, [story?.body, stdout?.columns])

  const maxOffset = Math.max(0, lines.length - contentHeight)

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      onBack()
      return
    }

    if (key.upArrow || input === 'k') {
      setScrollOffset((prev) => Math.max(0, prev - 1))
    }

    if (key.downArrow || input === 'j') {
      setScrollOffset((prev) => Math.min(maxOffset, prev + 1))
    }

    if (key.pageUp || input === 'u') {
      setScrollOffset((prev) => Math.max(0, prev - contentHeight))
    }

    if (key.pageDown || input === 'd') {
      setScrollOffset((prev) => Math.min(maxOffset, prev + contentHeight))
    }

    if (input === 'g') {
      setScrollOffset(0)
    }

    if (input === 'G') {
      setScrollOffset(maxOffset)
    }
  })

  const visibleLines = lines.slice(scrollOffset, scrollOffset + contentHeight)
  const progress =
    lines.length > 0
      ? Math.round(((scrollOffset + contentHeight) / lines.length) * 100)
      : 100

  return (
    <Box flexDirection="column" height={terminalHeight}>
      <Box borderStyle="single" borderColor="cyan" paddingX={1}>
        <Text bold color="cyan">
          소설 뷰어
        </Text>
        <Text dimColor> ({Math.min(progress, 100)}%)</Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        {visibleLines.map((line, index) => (
          <Text key={`line-${scrollOffset + index}`}>{line}</Text>
        ))}
      </Box>

      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          ↑↓/jk: 스크롤 | u/d: 페이지 | g/G: 처음/끝 | q: 돌아가기
        </Text>
      </Box>
    </Box>
  )
}
