import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type SocialProfileProps = {
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

const SocialProfile = ({
  linkedIn,
  instagram,
  facebook,
}: SocialProfileProps) => {
  return (
    <div className=' flex h-10'>
      <Link href={`${linkedIn}`} target='_blank' rel='noopener noreferrer'>
        <Image
          src={require(`../../assets/icons/linkedin.svg`)}
          alt='linkedin'
          width={40}
        />
      </Link>
      <Link href={`${instagram}`} target='_blank' rel='noopener noreferrer'>
        <Image
          src={require(`../../assets/icons/instagram.svg`)}
          alt='instagram'
          width={40}
        />
      </Link>
      <Link href={`${facebook}`} target='_blank' rel='noopener noreferrer'>
        <Image
          src={require(`../../assets/icons/facebook.svg`)}
          alt='facebook'
          width={40}
        />
      </Link>
    </div>
  );
};

export default SocialProfile;
