import Link from 'next/link'
import { ComponentProps } from 'react'

export function LayoutHeaderLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className="p-2 aspect-square rounded-full hover:bg-gray-800 transition-all"
      {...props}
    >
      {children}
    </Link>
  )
}
