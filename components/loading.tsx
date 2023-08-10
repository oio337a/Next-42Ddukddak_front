import Image from 'next/image';
import tempPic from '../public/Ddukddak_logo.png';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src={tempPic} alt="mainIMG" placeholder="blur" className="w-auto h-auto pb-[40px]" />
      <div></div>
      <div className="text-[100px] animate-bounce">👀</div>
      <div className="text-5xl font-bold text-gray-900">로딩중...💻</div>
      <div className="underline text-gray-600 mt-2">현재 API를 요청하고 있는 것 같네요...</div>
    </div>
  );
}
