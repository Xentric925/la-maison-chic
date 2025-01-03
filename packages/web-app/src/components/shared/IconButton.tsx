import Image from 'next/image';

type IconButtonPropTypes = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  text?: string;
  invert?: boolean;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonPropTypes> = ({
  src,
  alt,
  width,
  height,
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center space-x-2'
    >
      <Image
        src={require(`../../assets/icons/${src}.svg`)}
        alt={alt}
        width={width}
        height={height}
      />
      {text && <h3 className='text-base'>{text}</h3>}
    </button>
  );
};

export default IconButton;
