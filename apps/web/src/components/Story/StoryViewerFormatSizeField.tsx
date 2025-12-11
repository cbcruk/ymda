'use client'

import Image from 'next/image'
import { ComponentProps, PropsWithChildren } from 'react'

function StoryViewerFormatSizeField({ children }: PropsWithChildren) {
  return <label className="flex items-center gap-1">{children}</label>
}

type StoryViewerFormatSizeSelectReturn = ComponentProps<
  typeof StoryViewerFormatSizeSelect
>

type StoryViewerFormatSizeSelectProps = PropsWithChildren<
  ComponentProps<'select'> & {
    onChangeValue: (value: string) => void
  }
>

function StoryViewerFormatSizeSelect({
  children,
  onChangeValue,
  ...props
}: StoryViewerFormatSizeSelectProps) {
  return (
    <select
      className="items-center text-xs"
      onChange={(e) => {
        onChangeValue(e.target.value)
      }}
      {...props}
    >
      {children}
    </select>
  )
}

export function StoryViewerFormatSizeText(
  props: StoryViewerFormatSizeSelectReturn
) {
  return (
    <StoryViewerFormatSizeField>
      <Image src="/format_size.svg" alt="" width={16} height={16} />
      <StoryViewerFormatSizeSelect {...props}>
        <option value="base">기본</option>
        <option value="lg">크게</option>
        <option value="xl">아주 크게</option>
      </StoryViewerFormatSizeSelect>
    </StoryViewerFormatSizeField>
  )
}

export function StoryViewerFormatSizeLine(
  props: StoryViewerFormatSizeSelectReturn
) {
  return (
    <StoryViewerFormatSizeField>
      <Image src="/format_line_spacing.svg" alt="" width={16} height={16} />
      <StoryViewerFormatSizeSelect {...props}>
        <option value="normal">보통</option>
        <option value="relaxed">넉넉하게</option>
        <option value="loose">매우 넓게</option>
      </StoryViewerFormatSizeSelect>
    </StoryViewerFormatSizeField>
  )
}
