import React from 'react';
import Image from 'next/image';

type SectionTitlePropTypes = {
  image: string;
  title: string;
};

const SectionTitle = ({ image, title }: SectionTitlePropTypes) => {
  return (
    <div className='inline-flex space-x-3 items-center'>
      <div className='border border-gray-300 rounded-xl p-2 shadow-md'>
        <Image
          src={require(`../../assets/icons/${image}.svg`)}
          alt='icon'
          className='icon-blue w-5 h-5'
        />
      </div>
      <span className='font-medium text-xl'>{title}</span>
    </div>
  );
};

export default SectionTitle;
