import React from 'react';

interface HamburgerIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ color = 'black', ...props }) => {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hamburger-icon"
      {...props}
    >
      <line
        className="line top"
        x1="0"
        y1="6"
        x2="32"
        y2="6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        className="line bottom"
        x1="0"
        y1="18"
        x2="32"
        y2="18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default HamburgerIcon;
