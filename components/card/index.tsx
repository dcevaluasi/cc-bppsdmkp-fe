import Cookies from "js-cookie";
import { type ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;

  onClick?: () => void;
};

function Card(props: Props) {
  const { className, children, onClick } = props;
  const selectedTab = Cookies.get("SelectedTab");
  return (
    <div
      onClick={onClick}
      className={`!z-5 relative flex flex-col rounded-[20px]  bg-clip-border  shadow-shadow-500 bg-navy-800  duration-700 cursor-pointer text-white shadow-none group ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
