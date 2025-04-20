import clsx from "clsx";

export const Footer = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={clsx(className, 'text-center text-sm')}>
      <p>
        2025 &copy;{" "} All rights reserved.
      </p>
    </div>
  );
}