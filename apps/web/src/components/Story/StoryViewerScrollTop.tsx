import Image from 'next/image'
import { StoryViewerToolbarButton } from './StoryViewerToolbarButton'

export function StoryViewerScrollTop() {
  return (
    <StoryViewerToolbarButton
      onClick={() => {
        window.scrollTo(0, 0)
      }}
    >
      <Image src="/arrow_upward.svg" alt="" width={24} height={24} />
    </StoryViewerToolbarButton>
  )
}
