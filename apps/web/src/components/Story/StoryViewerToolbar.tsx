'use client'

import { PropsWithChildren } from 'react'
import { StoryViewerScrollTop } from './StoryViewerScrollTop'

export function StoryViewerToolbar({ children }: PropsWithChildren) {
  return (
    <div className="fixed right-0 bottom-0 p-4 flex flex-col gap-2">
      {children}
      <StoryViewerScrollTop />
    </div>
  )
}
