// eslint-disable-next-line import/no-cycle
import { cls } from '@/libs/utils';
import { ModalContext } from '@/pages';
import React, { ReactElement, useContext } from 'react';
import { Confirm } from './modal';

interface ButtonProps {
  svg?: ReactElement;
  text?: string;
  cancel?: boolean;
  time?: string;
  reservedTime?: string;
  setIsOk?: React.Dispatch<React.SetStateAction<Confirm>>;
}

export default function Button({ svg, text, cancel, reservedTime, setIsOk }: ButtonProps) {
  const [isConfirm, setIsConfirm] = useContext(ModalContext);
  const onClickBtn = () => {
    if (!cancel && text) {
      setIsConfirm({
        isConfirm: true,
        reservedTime: reservedTime,
      });
    } else if (cancel && text) {
      if (setIsOk) {
        setIsOk({ confirm: false });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={onClickBtn}
      className={cls(
        cancel ? 'bg-violet-300' : 'bg-violet-600',
        'text-center  rounded-2xl px-2 transition-colors hover:text-white focus:text-white focus:outline-none',
      )}
    >
      {svg}
      {text ? <div className="p-3 font-semibold text-xl">{text}</div> : null}
    </button>
  );
}
