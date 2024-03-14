import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

const TwoThirdsWidthWrapper = ({ className, children }) => {
    return (
        <div
            className={cn(`mx-auto max-w-[66.666%] px-2.5 md:px-20`, className)}
        >
            {children}
        </div>
    );
};

export default TwoThirdsWidthWrapper;
