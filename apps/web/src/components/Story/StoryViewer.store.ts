import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Settings = {
  text: string
  leading: string
}

type StoryViewerState = {
  settings: Settings
  updateSettings: (setting: Partial<Settings>) => void
}

export const useStoryViewerStore = create<StoryViewerState>()(
  persist(
    (set) => ({
      settings: {
        text: 'base',
        leading: 'normal',
      },
      updateSettings: (setting) => {
        set((prev) => {
          return {
            settings: {
              ...prev.settings,
              ...setting,
            },
          }
        })
      },
    }),
    {
      name: 'story-viewer-store',
    }
  )
)
