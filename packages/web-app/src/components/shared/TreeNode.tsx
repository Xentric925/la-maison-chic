import React from 'react';
import '@/styles/components/_tree.scss';

export interface TreeNodeProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

function TreeNode({ label, children, onClick }: TreeNodeProps) {
  return (
    <li className='tree-node' onClick={onClick}>
      {label}
      {React.Children.count(children) > 0 && (
        <ul className='tree-children'>{children}</ul>
      )}
    </li>
  );
}

export default TreeNode;
