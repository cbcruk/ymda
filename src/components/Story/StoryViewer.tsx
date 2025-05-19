'use client'

import { PropsWithChildren } from 'react'
import { StoryViewerToolbar } from './StoryViewerToolbar'
import { StoryViewerBody } from './StoryViewerBody'
import {
  StoryViewerFormatSize,
  StoryViewerFormatSizeForm,
} from './StoryViewerFormatSize'
import {
  StoryViewerFormatSizeLine,
  StoryViewerFormatSizeText,
} from './StoryViewerFormatSizeField'
import { useStoryViewerStore } from './StoryViewer.store'

export function StoryViewer({ children }: PropsWithChildren) {
  const { settings, updateSettings } = useStoryViewerStore()

  return (
    <div
      data-settings-text={settings.text}
      data-settings-leading={settings.leading}
      className={`
        data-[settings-text=base]:text-base]
        data-[settings-text=lg]:text-lg]
        data-[settings-text=xl]:text-xl]
        data-[settings-leading=normal]:leading-normal]
        data-[settings-leading=relaxed]:leading-relaxed]
        data-[settings-leading=loose]:leading-loose]
        text-${settings.text}
        leading-${settings.leading}
      `}
    >
      <StoryViewerBody>{children}</StoryViewerBody>
      <StoryViewerToolbar>
        <StoryViewerFormatSize>
          <StoryViewerFormatSizeForm>
            <StoryViewerFormatSizeText
              defaultValue={settings.text}
              onChangeValue={(text) => updateSettings({ text })}
            />
            <StoryViewerFormatSizeLine
              defaultValue={settings.leading}
              onChangeValue={(leading) => updateSettings({ leading })}
            />
          </StoryViewerFormatSizeForm>
        </StoryViewerFormatSize>
      </StoryViewerToolbar>
    </div>
  )
}
