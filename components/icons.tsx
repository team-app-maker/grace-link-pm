import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function createIcon(path: ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {path}
      </svg>
    );
  };
}

export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

export const FolderIcon = createIcon(
  <>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
  </>,
);

export const FileIcon = createIcon(
  <>
    <path d="M7 3.5h7l4 4V20.5H7A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5Z" />
    <path d="M14 3.5V8h4.5" />
  </>,
);

export const SparkIcon = createIcon(
  <>
    <path d="M12 2.75 9.25 9.25 2.75 12l6.5 2.75L12 21.25l2.75-6.5L21.25 12l-6.5-2.75z" />
  </>,
);

export const LayersIcon = createIcon(
  <>
    <path d="m12 3 8 4.5-8 4.5L4 7.5z" />
    <path d="m4 12.25 8 4.5 8-4.5" />
    <path d="m4 16.75 8 4.5 8-4.5" />
  </>,
);

export const BranchIcon = createIcon(
  <>
    <path d="M7 4a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    <path d="M17 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    <path d="M7 9v4.25a2 2 0 0 0 2 2H14" />
    <path d="M17 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M17 9v6" />
  </>,
);

export const CheckCircleIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.75 12.25 2.25 2.25 4.5-4.75" />
  </>,
);

export const BookOpenIcon = createIcon(
  <>
    <path d="M4.5 5.75A2.25 2.25 0 0 1 6.75 3.5H18a1.5 1.5 0 0 1 1.5 1.5v12.75A1.75 1.75 0 0 1 17.75 19.5H7a2.5 2.5 0 0 0-2.5 2V5.75Z" />
    <path d="M7 3.5v16" />
  </>,
);

export const InfoIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 10v5" />
    <path d="M12 7.5h.01" />
  </>,
);
