'use client'

import { useActionState } from 'react'
import { sync } from '../../app/form/actions'

type FormProps = {
  action: typeof sync
}

export function StorySyncForm({ action }: FormProps) {
  const [, formAction, isPending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="p-4">
      <button
        type="submit"
        disabled={isPending}
        className="p-1 px-2 bg-gray-800 hover:bg-gray-800/90 rounded-lg text-sm hover:font-semibold transition-all"
      >
        동기화
      </button>
    </form>
  )
}
