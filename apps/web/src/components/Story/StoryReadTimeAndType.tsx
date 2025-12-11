import { StorySchema } from '@ymda/shared'

function getReadTimeAndType(charCount: number) {
  const minutes = Math.ceil(charCount / 400)
  const type = (() => {
    switch (true) {
      case charCount <= 20000:
        return '단편'
      case charCount <= 70000:
        return '중편'
      default:
        return '장편'
    }
  })()

  return {
    minutes,
    type,
  }
}

type ReadTimeAndTypeProps = Pick<StorySchema, 'size'>

export function StoryReadTimeAndType({ size }: ReadTimeAndTypeProps) {
  const { type } = getReadTimeAndType(size)

  return (
    <span className="relative w-[30px] h-[10px] rounded-full bg-lime-200 overflow-hidden">
      <span
        title={type}
        data-type={type}
        className="
          absolute top-0 left-0 h-full bg-blue-400 rounded-full
          data-[type=단편]:w-[25%]
          data-[type=중편]:w-[50%]
          data-[type=장편]:w-[75%]
        "
      />
    </span>
  )
}
