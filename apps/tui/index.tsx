#!/usr/bin/env node
import { useState, Suspense } from 'react'
import { render, Box, Text } from 'ink'
import { StoryList } from './components/StoryList.js'
import { StoryViewer } from './components/StoryViewer.js'

type Screen = { type: 'list' } | { type: 'viewer'; id: number }

function Loading() {
  return (
    <Box>
      <Text color="yellow">로딩 중...</Text>
    </Box>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'list' })

  const handleSelect = (id: number) => {
    setScreen({ type: 'viewer', id })
  }

  const handleBack = () => {
    setScreen({ type: 'list' })
  }

  return (
    <Box flexDirection="column">
      <Suspense fallback={<Loading />}>
        {screen.type === 'list' ? (
          <StoryList onSelect={handleSelect} />
        ) : (
          <StoryViewer id={screen.id} onBack={handleBack} />
        )}
      </Suspense>
    </Box>
  )
}

render(<App />)
