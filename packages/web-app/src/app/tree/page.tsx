/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import OrgTree from '@/components/shared/OrgTree';
import ScrollArea, { ScrollBar } from '@/components/ui/scroll-area';
import { API_URL } from '@/lib/constants';
import useStore from '@/lib/store';
import { fetcher } from '@/lib/utils';
import {
  ChevronDownCircle,
  ChevronLeftCircle,
  ChevronRightCircle,
  ChevronUpCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile: {
    profileImage: string | null;
    title: string;
  };
  directReports: User[];
};

interface TreeNode {
  oldTree: TreeNode | null;
  tree: User | null;
}

function page() {
  const [index, setIndex] = useState(0);
  const {
    data: orgData,
    isLoading,
    error,
  } = useSWR(`${API_URL}/users/org-hierarchy`, fetcher, {
    dedupingInterval: 60000 * 10, // Cache data for 10 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTree, setSelectedTree] = useState<TreeNode>({
    oldTree: {
      oldTree: null, // Initially null, meaning no previous state
      tree: null, // The initial tree data will be null
    },
    tree: null, // Setting the initial tree from orgData
  });
  useEffect(() => {
    if (orgData)
      setSelectedTree({
        oldTree: { tree: null, oldTree: null },
        tree: orgData[index],
      });
  }, [orgData, index]);
  //console.log(selectedTree.tree);
  const { user } = useStore();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Failed to load data</div>;

  const setSelectedIndexFromChild = (index: number) => {
    setSelectedIndex(index);
  };

  const handleBackButtonClick = () => {
    // Check if oldTree is available, else fallback to the initial tree structure
    setSelectedTree((prevState) => ({
      oldTree: prevState.oldTree?.oldTree || { oldTree: null, tree: null },
      tree: prevState.oldTree?.tree || prevState.tree,
    }));
    setSelectedIndex(0);
  };

  const handleDownButtonClick = () => {
    setSelectedTree((old) => ({
      oldTree: old,
      tree: old.tree?.directReports[selectedIndex] || null,
    }));
    setSelectedIndex(0);
  };

  return (
    <div className='flex flex-col h-full w-full relative'>
      {/* Back button */}
      {selectedTree.oldTree && selectedTree.oldTree.oldTree && (
        <button
          className='absolute z-10 top-4 left-1/2 transform -translate-x-1/2 bg-transparent text-white font-bold py-2 px-4 rounded opacity-60 hover:opacity-100 transition-opacity duration-300'
          onClick={handleBackButtonClick}
        >
          <ChevronUpCircle color='black' />
        </button>
      )}

      {/* Org Tree Section */}
      {/* Left navigation button */}
      {index > 0 && (
        <button
          className='absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-transparent text-white font-bold py-2 px-4 rounded opacity-60 hover:opacity-100 transition-opacity duration-300'
          onClick={() => {
            setIndex((i) => i - 1);
            setSelectedIndex(0);
          }}
        >
          <ChevronLeftCircle color='black' />
        </button>
      )}
      <ScrollArea className='h-full w-full pt-20'>
        <div className='flex flex-row h-full w-full justify-center items-center'>
          {/* Org Tree Component */}
          <OrgTree
            tree={selectedTree.tree}
            setSelectedIndex={setSelectedIndexFromChild}
            loggedInId={user?.id || 1}
          />
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      {/* Right navigation button */}
      {index < orgData.length && (
        <button
          className='absolute z-10 top-1/2 right-4 transform -translate-y-1/2 bg-transparent text-white font-bold py-2 px-4 rounded opacity-60 hover:opacity-100 transition-opacity duration-300'
          onClick={() => {
            setIndex((i) => i + 1);
            setSelectedIndex(0);
          }}
        >
          <ChevronRightCircle color='black' />
        </button>
      )}

      {/* Down button */}
      {selectedTree.tree?.directReports[selectedIndex] &&
        selectedTree.tree.directReports[selectedIndex].directReports.length >
          0 && (
          <button
            className='absolute z-10 bottom-4 left-1/2 transform -translate-x-1/2 bg-transparent text-white font-bold py-2 px-4 rounded opacity-60 hover:opacity-100 transition-opacity duration-300'
            onClick={handleDownButtonClick}
          >
            <ChevronDownCircle color='black' />
          </button>
        )}
    </div>
  );
}

export default page;
