import { MdTipsAndUpdates } from "react-icons/md";

const FreeCard = () => {
  return (
    <div className="relative invisible mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-navy-800 to-navy-700  pb-4">
      <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-navy-700 to-navy-800 dark:!border-navy-800">
        <MdTipsAndUpdates className="h-[41px] w-[41px] ml-2" />
      </div>

      <div className="mt-16 flex h-fit invisible flex-col items-center">
        <p className="text-base font-bold text-white">Upgrade to PRO</p>
        <p className="mt-1 px-4 text-center text-sm text-gray-400">
          Improve your development process and start doing more with Horizon UI
          PRO!
        </p>

        <a
          target="blank"
          className="text-sm mt-7 block rounded-full bg-gradient-to-br from-navy-800 to-white/10 py-[12px] px-11 text-center  text-white hover:bg-gradient-to-b hover:from-white/40 hover:to-white/5 "
          href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
        >
          Upgrade to PRO
        </a>
      </div>
    </div>
  );
};

export default FreeCard;
