import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}

const MaxWidthWrapper = ({ className, children }) => {
  return (
    <div
      className={cn(
        `mx-auto w-full max-w-screen px-2.5 md:px-20`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;