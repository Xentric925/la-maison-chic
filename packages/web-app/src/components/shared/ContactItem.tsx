import React from 'react';
import Image from 'next/image';

type ContactItemProps = {
  imgSrc: string;
  label: string;
  value?: string;
  classes?: string;
};

const ContactItem = ({ imgSrc, label, value, classes }: ContactItemProps) => {
  return (
    <div className='flex space-x-2'>
      <Image
        src={require(`../../assets/icons/${imgSrc}.svg`)}
        alt='icon'
        width={25}
        height={25}
        className={classes}
      />
      <span>{label}</span>
      <span className='text-blue-500'>{value}</span>
    </div>
  );
};

export default ContactItem;
