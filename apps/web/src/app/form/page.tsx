import { sync } from './actions'
import { StorySyncForm } from '../../components/Story/StorySyncForm'

function Page() {
  return <StorySyncForm action={sync} />
}

export default Page
