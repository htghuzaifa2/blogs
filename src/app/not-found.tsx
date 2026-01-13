import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary tracking-tighter">404</h1>
      <h2 className="text-3xl font-headline font-bold mt-2">Page Not Found</h2>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}
