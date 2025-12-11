import { useState, use } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import { getItems } from '@ymda/shared'

interface Props {
  onSelect: (id: number) => void
}

const storiesPromise = getItems()

export function StoryList({ onSelect }: Props) {
  const stories = use(storiesPromise)
  const [cursor, setCursor] = useState(0)
  const [offset, setOffset] = useState(0)
  const { exit } = useApp()

  const visibleCount = 15

  useInput((input, key) => {
    if (input === 'q') {
      exit()

      return
    }

    if (key.upArrow || input === 'k') {
      setCursor((prev) => {
        const next = Math.max(0, prev - 1)

        if (next < offset) {
          setOffset(next)
        }

        return next
      })
    }

    if (key.downArrow || input === 'j') {
      setCursor((prev) => {
        const next = Math.min(stories.length - 1, prev + 1)

        if (next >= offset + visibleCount) {
          setOffset(next - visibleCount + 1)
        }

        return next
      })
    }

    if (key.return) {
      const story = stories[cursor]

      if (story) {
        onSelect(story.id)
      }
    }
  })

  const visibleStories = stories.slice(offset, offset + visibleCount)

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          소설 목록
        </Text>
        <Text dimColor>
          {' '}
          ({cursor + 1}/{stories.length})
        </Text>
      </Box>

      {visibleStories.map((story, index) => {
        const actualIndex = offset + index
        const isSelected = actualIndex === cursor
        const readingTime = Math.ceil(story.size / 500)

        return (
          <Box key={story.id}>
            <Text color={isSelected ? 'green' : undefined}>
              {isSelected ? '▶ ' : '  '}
            </Text>
            <Text bold={isSelected} color={isSelected ? 'green' : undefined}>
              {story.title}
            </Text>
            <Text dimColor> ({readingTime}분)</Text>
          </Box>
        )
      })}

      <Box marginTop={1}>
        <Text dimColor>↑↓/jk: 이동 | Enter: 선택 | q: 종료</Text>
      </Box>
    </Box>
  )
}
