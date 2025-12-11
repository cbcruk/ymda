import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type StoryViewerToolbarButtonProps = ComponentProps<'button'>

export function StoryViewerToolbarButton({
  children,
  className,
  ...props
}: StoryViewerToolbarButtonProps) {
  return (
    <button
      className={twMerge(
        'bg-gray-800 rounded-full p-2 shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
