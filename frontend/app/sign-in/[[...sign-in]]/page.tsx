import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center py-20 h-screen">
      <SignIn />
    </div>
  )
}