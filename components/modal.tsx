import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';
const Button = dynamic(import('./button'));

type ModalProps = {
  title?: string;
  subText?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTime: boolean;
};

export type Confirm = {
  confirm: boolean | undefined;
};
export default function Modal({ title, subText, setIsOpen, setTime }: ModalProps) {
  const [reservedTime, setReservedTime] = useState<string>('');
  const [isOk, setIsOk] = useState<Confirm>({ confirm: undefined });

  const handleTimeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReservedTime(e.target.value);
  };

  useEffect(() => {
    if (isOk?.confirm === false) {
      setIsOpen(false);
    }
  }, [isOk]);

  return (
    <div className="flex justify-center items-center h-screen fixed z-[2]">
      <div className="bg-black h-screen bg-opacity-40 w-screen flex justify-center items-center fixed top-0 left-0">
        <div className="bg-white bg-opacity-100 flex flex-col justify-between items-center border rounded-3xl w-[480px] h-96 shadow-xl">
          <h2 className="text-3xl mt-12 text-violet-700">{title}</h2>
          <span className="text-xl font-semibold">{subText}</span>
          {setTime ? (
            <div className="flex justify-center items-center space-x-4">
              <span className="text-xl font-semibold">시간</span>
              <input onChange={handleTimeValue} type="time" className="border-2 border-gray-300 rounded-lg w-full" />
            </div>
          ) : null}
          <div className="flex w-1/2 mb-10 justify-between items-center">
            <Button text="취소" cancel setIsOk={setIsOk} />
            <Button text="확인" reservedTime={reservedTime} />
          </div>
        </div>
      </div>
    </div>
  );
}
