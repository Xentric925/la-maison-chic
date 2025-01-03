// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='h-full flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-6xl font-bold text-gray-800'>404</h1>
      <p className='text-gray-600 text-lg mt-4'>
        Sorry, the page you are looking for does not exist or haven&apos;t been
        implemented yet.
      </p>
      <Link href='/'>
        <button className='mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300'>
          Go to Homepage
        </button>
      </Link>
    </div>
  );
}
