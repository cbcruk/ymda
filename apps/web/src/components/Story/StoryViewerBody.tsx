'use client'

import { PropsWithChildren } from 'react'

export function StoryViewerBody({ children }: PropsWithChildren) {
  return (
    <div className="p-4 break-words whitespace-pre-wrap break-keep">
      {children}
    </div>
  )
}
