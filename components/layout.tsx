import { cls } from '../libs/utils';
import Image from 'next/image';
import logoPic from '../public/Ddukddak_logo.png';
import React, { useState } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

function deleteCookie(cookieName: string) {
  // 현재 시간보다 이전 날짜로 만료일을 설정하여 쿠키를 삭제합니다.
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function Layout({ children }: LayoutProps) {
  const [showBtn, setShowBtn] = useState<boolean>(false);

  return (
    <div>
      <div className="text-lg font-medium fixed text-gray-800 top-8 left-8 flex flex-col items-center rounded-full ">
        <div
          className={cls(showBtn ? 'animate-spin' : '', 'rounded-full flex justify-center items-center')}
          onClick={() => setShowBtn(!showBtn)}
        >
          <Image
            src={logoPic}
            alt="logo"
            placeholder="blur"
            className="w-12 h-12 shadow-xl rounded-full border border-gray-400 my-hover"
          />
        </div>
        {/* Speed Dial 액션들 */}
        {showBtn && (
          <div className="mt-2 space-y-2 flex flex-col">
            <Link href={'/'}>
              <button className="bg-white rounded-full border self-center border-gray-200 w-11 h-11 hover:bg-violet-400 transition shadow-xl my-hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" fill-opacity="0" d="M6 8L12 3L18 8V20H16V13L15 12H9L8 13V20H6V8Z">
                    <animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;0.3" />
                  </path>
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path stroke-dasharray="21" stroke-dashoffset="21" d="M5 21H19">
                      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="21;0" />
                    </path>
                    <path stroke-dasharray="15" stroke-dashoffset="15" d="M5 21V8M19 21V8">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="15;0" />
                    </path>
                    <path stroke-dasharray="24" stroke-dashoffset="24" d="M9 21V13H15V21">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0" />
                    </path>
                    <path stroke-dasharray="26" stroke-dashoffset="26" d="M2 10L12 2L22 10">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="26;0" />
                    </path>
                  </g>
                </svg>
              </button>
            </Link>
            <Link href={'/mypage'}>
              <button className="bg-white rounded-full border self-center border-gray-200 w-11 h-11 hover:bg-violet-400 transition shadow-xl my-hover">
                My
              </button>
            </Link>
            <Link href={'/developer'}>
              <button className="bg-white rounded-full border self-center border-gray-200 w-11 h-11 hover:bg-violet-400 transition shadow-xl my-hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
                  />
                </svg>
              </button>
            </Link>
            <Link href={'/logout'}>
              <button className="bg-white rounded-full self-center border-gray-200 w-11 h-11 hover:bg-violet-400 transition shadow-xl my-hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                  <path
                    fill="currentColor"
                    d="M17 1v1h1v4h-1V5h-1V3H6v16h10v-2h1v-1h1v4h-1v1H5v-1H4V2h1V1h12m-4 5h2v1h1v1h1v1h1v1h1v2h-1v1h-1v1h-1v1h-1v1h-2v-2h1v-1h1v-1H8v-2h7V9h-1V8h-1V6Z"
                  />
                </svg>
              </button>
            </Link>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
