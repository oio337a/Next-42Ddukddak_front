import dynamic from 'next/dynamic';

import { useContext, useEffect, MouseEvent, useState } from 'react';
import { AppContext, ModalContext } from '@/pages';
import axios from 'axios';
import { IResponse } from '@/interface/Context';
import * as modalMessage from '@/const/modalMessage';
import { IText } from '@/interface/Modal';
const Modal = dynamic(import('./modal'));
const RightBlockHeader = dynamic(import('./rightBlockHeader'));

export default function WholeDdukddak() {
  const [info, setInfo] = useContext(AppContext);
  const [roomList, setRoomList] = useState<Array<IResponse>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useContext(ModalContext);
  const [target, setTarget] = useState<IResponse | null>(null);
  const [text, setText] = useState<IText>();

  // 처음 마운트 되면 roomList 가져오기
  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const response = await axios.get('/api/chat/roomList');
        setRoomList(response.data);
      } catch (err) {
        console.log('roomList get', err);
      }
    };
    fetchRoomList();
  });

  // 참가한 방이 있는데 방 이동시 post 요청
  const requestChangeRoom = async () => {
    try {
      await axios.post(`/api/chat/private/${target?.roomId}/entrance`).then((res) => {
        if (res.status === 200) {
          setInfo({
            ddukddak: true,
            context: info.context,
            roomInfo: target,
          });
          setIsConfirm({ isConfirm: false });
          setIsOpen(false);
        }
      });
    } catch (error) {
      console.log('requestChangeRoom err : ', error);
    }
  };

  // 모달 상황에 따른 행동 (방들어가기)
  useEffect(() => {
    if (isConfirm.isConfirm) {
      if (!info.roomInfo?.roomId) {
        setInfo({
          ddukddak: true,
          context: info.context,
          roomInfo: target,
        });
        setIsConfirm({ isConfirm: false });
        setIsOpen(false);
      } else if (target?.roomId) {
        requestChangeRoom();
      }
    }
  }, [isConfirm.isConfirm]);

  // 방 이동 관련 이미 참가한 방 이거나 새로운 방이거나
  useEffect(() => {
    if (target?.roomId) {
      if (info.roomInfo?.roomId === target?.roomId) {
        alert('당신이 있는 방이야 이놈아.');
        setTarget(null);
      } else {
        if (info.roomInfo?.roomId) {
          setText({
            title: modalMessage.default.CHANGE_ROOM.title,
            subText: modalMessage.default.CHANGE_ROOM.subText,
          });
        } else {
          setText({
            title: modalMessage.default.ENTER_ROOM.title,
            subText: modalMessage.default.ENTER_ROOM.subText,
          });
        }
        setIsOpen(true);
      }
    }
  }, [target?.roomId]);

  // 방 클릭 이벤트 리스너
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const t = event.currentTarget.getAttribute('data-custom');
    if (t !== null) {
      const jsonTarget = JSON.parse(t);
      if (jsonTarget.roomId === target?.roomId) {
        alert('당신이 있는 방이야 이놈아.');
      } else {
        setTarget(JSON.parse(t));
      }
    }
  };

  return (
    <div className="flex flex-col border-2 rounded-3xl py-4 px-5 shadow-2xl h-screen max-h-[50vh] xl:min-h-[85vh]">
      <RightBlockHeader text={'전체 뚝딱'} isSearch />
      {isOpen && target ? (
        <Modal
          title={text?.title}
          subText={`${target.roomName} ${text?.subText}`}
          setIsOpen={setIsOpen}
          setTime={false}
        />
      ) : null}
      <div className="divide-y-[1px] space-y-4 mt-2 overflow-auto">
        {roomList.map((item, i) => (
          <div
            key={i}
            data-custom={JSON.stringify(item)}
            onClick={onClick}
            className="flex justify-between px-8 py-3 hover:shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <h2 className="self-center text-lg font-semibold w-3/5">{item.roomName}</h2>
            <div className="flex flex-col justify-center items-end space-y-1">
              <span className=" bg-violet-500 py-1 px-2 rounded-md text-white shadow-md">{item.participantsNum}</span>
              <span className="text-sm border-b-2 shadow-sm border-violet-300">폭파까지 {item.remainingTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
