import Image from 'next/image'
import Link from 'next/link'
import { LayoutHeaderLink } from './LayoutHeaderLink'

export function LayoutHeader() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[var(--background)]">
      <Link href="/" className="flex">
        <Image src="/logo.svg" alt="" width={107} height={30} />
      </Link>

      <div className="flex gap-2 font-medium text-sm">
        <LayoutHeaderLink href="/contents">
          <Image src="/folder.svg" alt="" width={24} height={24} />
        </LayoutHeaderLink>
        <LayoutHeaderLink href="/tags">
          <Image src="/tag.svg" alt="" width={24} height={24} />
        </LayoutHeaderLink>
      </div>
    </div>
  )
}
