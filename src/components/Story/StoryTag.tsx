import { PropsWithChildren } from 'react'

export function StoryTag({ children }: PropsWithChildren) {
  return (
    <span className="p-1 px-2 bg-gray-900 hover:bg-gray-800 hover:text-gray-50 rounded-lg text-xs transition-all">
      {children}
    </span>
  )
}
