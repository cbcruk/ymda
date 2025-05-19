'use client'

import { Popover } from 'radix-ui'
import Image from 'next/image'
import { StoryViewerToolbarButton } from './StoryViewerToolbarButton'
import { PropsWithChildren } from 'react'

export function StoryViewerFormatSize({ children }: PropsWithChildren) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <StoryViewerToolbarButton className="bg-gray-600">
          <Image src="/zoom_in.svg" alt="" width={24} height={24} />
        </StoryViewerToolbarButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" side="top" sideOffset={10}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function StoryViewerFormatSizeForm({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-900 rounded-lg shadow-2xl">
      {children}
    </div>
  )
}
