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

export const ArrowRightIcon = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>,
);

export const CompassIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m14.8 9.2-2 5.6-5.6 2 2-5.6z" />
  </>,
);

export const ShieldIcon = createIcon(
  <>
    <path d="M12 3.5 5.5 6v5.5c0 4 2.9 7.1 6.5 8.9 3.6-1.8 6.5-4.9 6.5-8.9V6z" />
    <path d="m9.5 12.5 1.7 1.7 3.6-4" />
  </>,
);

export const MessageCircleIcon = createIcon(
  <>
    <path d="M12 19.5c4.7 0 8.5-3.2 8.5-7.2S16.7 5 12 5 3.5 8.2 3.5 12.3c0 1.8.8 3.5 2.2 4.7l-.7 3.5 3.4-1.8c1.1.5 2.3.8 3.6.8Z" />
  </>,
);

export const WalletIcon = createIcon(
  <>
    <path d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 17 19H7A2.5 2.5 0 0 1 4.5 16.5z" />
    <path d="M4.5 9.5h14" />
    <circle cx="15.5" cy="14.25" r="1" />
  </>,
);
