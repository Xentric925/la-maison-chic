import React from 'react';
import '@/styles/components/_tree.scss';
import TreeNode, { TreeNodeProps } from './TreeNode';

export interface TreeProps {
  label: TreeNodeProps['label'];
  children: TreeNodeProps['children'];
  onClick?: () => void;
  className?: string;
}

function Tree({ label, children, onClick, className }: TreeProps) {
  return (
    <ul className={`tree ${className ?? ''}`} onClick={onClick}>
      <TreeNode label={label}>{children}</TreeNode>
    </ul>
  );
}

export default Tree;
