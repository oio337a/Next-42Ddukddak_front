import getCookieValue from '@/libs/getCookieValue';
import { AppContext } from '@/pages/index';
import { useContext } from 'react';

interface HeaderProps {
  text: string;
  isSearch?: boolean;
  mypage?: boolean;
}

export default function RightBlockHeader({ text, isSearch, mypage }: HeaderProps) {
  const [info, setInfo] = useContext(AppContext);
  const intraId = getCookieValue('intraId');
  const handleClick = () => {
    setInfo({
      ddukddak: info.ddukddak,
      context: !info.context,
      roomInfo: info.roomInfo,
    });
  };
  return (
    <div className="flex justify-between">
      <div className="flex space-x-2 m-1">
        <h2 className="text-2xl font-semibold text-violet-950">{text}</h2>
        {isSearch ? (
          <div className="mt-1 flex justify-center items-center rounded-full cursor-pointer w-7 h-7 hover:text-violet-800 hover:bg-violet-200 hover:shadow-md transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        ) : null}
      </div>
      {mypage || info.roomInfo?.login === intraId ? null : (
        <div onClick={handleClick} className="m-1">
          <div className="flex items-center justify-center rounded-full cursor-pointer w-8 h-8 hover:text-violet-800 hover:bg-violet-200 hover:shadow-md transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
