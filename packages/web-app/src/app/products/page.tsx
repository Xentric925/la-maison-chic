'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { API_URL } from '@/lib/constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import PaginationComponent from '@/components/shared/Pagination';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { useSidebar } from '@/components/ui/sidebar';
import useStore from '@/lib/store';
import { Edit, PlusCircle } from 'lucide-react';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: [
    {
      url: string;
    },
  ];
};

const ProductPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const currentPage = parseInt(page as string, 10);
  const { open: isSidebarOpen } = useSidebar();
  const { user: currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lastSuccessfulSearch, setLastSuccessfulSearch] = useState('');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (noResults && debouncedSearch.startsWith(lastSuccessfulSearch)) {
        return;
      }
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, debouncedSearch, lastSuccessfulSearch, noResults]);

  const {
    data: products,
    error,
    isLoading,
  } = useSWR(
    debouncedSearch || !noResults
      ? `${API_URL}/products?page=${currentPage - 1}&limit=10&search=${debouncedSearch}`
      : null,
    fetcher,
    {
      dedupingInterval: 60000 * 10,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (data.data?.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setLastSuccessfulSearch(search);
        }
      },
    },
  );
  const getGridCols = () => {
    if (isSidebarOpen) {
      return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
    }
    return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
  };

  if (error)
    return (
      <div className='p-4 flex flex-col items-center justify-center text-center'>
        <h1 className='text-xl font-semibold text-red-500'>Error</h1>
        <p className='text-gray-600'>
          Failed to fetch products. Please try again later.
        </p>
        <p className='text-gray-600'>{error.message}</p>
      </div>
    );

  const totalPages = products?.next ? currentPage + 1 : currentPage;

  return (
    <>
      <div className='flex flex-row gap-1 fixed top-3 right-6 z-50'>
        {currentUser?.role === 'ADMIN' && (
          <Link href='/products/create' className='flex items-center'>
            <PlusCircle color='blue' />
          </Link>
        )}
        <Input
          type='search'
          placeholder='Search products'
          className='w-40 xl:w-60'
          value={search}
          onChange={(e) => {
            const newSearch = e.target.value;
            if (newSearch.length < search.length) {
              setNoResults(false);
            }
            setSearch(newSearch);
          }}
        />
      </div>
      {isLoading ? (
        <div className='flex flex-col h-full items-center justify-between'>
          <div className={`grid gap-4 ${getGridCols()} justify-center`}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className='w-[192px] h-[236px] rounded-lg bg-slate-50 border border-stone-200'
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col h-full items-center justify-between'>
          <div className={`grid gap-4 ${getGridCols()} justify-center`}>
            {products?.length > 0 ? (
              products.map((product: Product) => (
                <div key={product.id} className='relative'>
                  {currentUser?.role === 'ADMIN' && (
                    <Link
                      href={`/products/${product.id}/manage`}
                      className='absolute top-2 right-2'
                    >
                      <Edit className='w-6 h-6 text-blue-500' />
                    </Link>
                  )}
                  <Link
                    href={`/products/${product.id}`}
                    className='flex flex-col justify-center items-center'
                  >
                    <Image
                      src={product.images && product.images[0].url}
                      alt={product.name}
                      className='w-full h-32 object-cover rounded'
                      width={192}
                      height={192}
                    />
                    <h2 className='text-lg font-semibold'>{product.name}</h2>
                    <p className='text-sm text-gray-600'>
                      {product.description}
                    </p>
                    <p className='text-sm font-bold text-blue-500'>
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className='col-span-full p-4 flex flex-col items-center justify-center text-center'>
                <h1 className='text-xl font-semibold text-red-500'>
                  No Products Found
                </h1>
                {search !== '' && (
                  <p className='text-gray-600'>
                    No products found with the search term &apos;{search}&apos;
                  </p>
                )}
              </div>
            )}
          </div>
          <PaginationComponent
            page={currentPage}
            totalPages={totalPages}
            baseUrl={`/products?search=${debouncedSearch}`}
            noQuestionMark
          />
        </div>
      )}
    </>
  );
};

export default ProductPage;
