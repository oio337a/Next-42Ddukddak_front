import dynamic from 'next/dynamic';

import { useEffect, useState, KeyboardEvent, useRef, useCallback } from 'react';
import useHandleInputMessage from '@/libs/inputMessage';
import { IChatDetail } from '@/interface/ChatDetail';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import getCookieValue from '@/libs/getCookieValue';
import { cls } from '@/libs/utils';
import { formatTime } from '@/libs/formatTime';
import useHandleMouseIndex from '@/libs/mouseIndex';
const Button = dynamic(import('./button'));
const RightBlockHeader = dynamic(import('./rightBlockHeader'));

export default function PublicChatting() {
  const { inputMessage, handleInputMessage, handleDeleteInputMessage } = useHandleInputMessage();
  const [chatMessage, setChatMessage] = useState<IChatDetail>();
  const [chatMessageList, setChatMessageList] = useState<IChatDetail[]>([]);
  const [chkLog, setChkLog] = useState(false);
  const [roomId, setRoomId] = useState('');
  const client = useRef<CompatClient>();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { mouseOnIndex, handleMouseOut, handleMouseOver } = useHandleMouseIndex();
  const intraId = getCookieValue('intraId');

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessageList]);

  const msgBox = chatMessageList.map((item, idx) => (
    <div
      key={idx}
      onMouseOver={() => handleMouseOver(idx)}
      className={cls(
        item.sender === intraId ? 'flex-row-reverse' : '',
        'flex items-start text-gray-800 space-x-2 text-sm',
      )}
    >
      {item.sender === intraId ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mt-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mt-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}

      <div className="p-2 border border-gray-300 rounded-md">
        <p>{item.message}</p>
      </div>
      <span className="self-end">{formatTime(item.time)}</span>
      {mouseOnIndex === idx && item.sender !== intraId ? (
        <span
          onClick={() => onReport(`${item.sender}`)}
          className="self-end px-1 hover:bg-violet-200 cursor-pointer rounded-full"
        >
          신고
        </span>
      ) : null}
    </div>
  ));

  useEffect(() => {
    if (!chkLog) {
      connectHandler('999');
      setChkLog(true);
    }
  });

  const onReport = (message: string) => {
    console.log('신고할 메세지 : ', message);
    // 백엔드 api 호출 해야함.
  };

  const sendHandler = () => {
    if (inputMessage) {
      try {
        client.current?.send(
          '/pub/chat/message/public',
          {},
          JSON.stringify({
            roomId: roomId,
            sender: intraId,
            message: inputMessage,
          }),
        );
      } catch (error) {
        console.log(error);
      }
      handleDeleteInputMessage();
    }
  };

  useEffect(() => {
    if (chatMessage) {
      setChatMessageList([...chatMessageList, chatMessage]);
    }
  }, [chatMessage]);

  const connectHandler = (id: string) => {
    client.current = Stomp.over(() => {
      try {
        const sock = new SockJS('http://localhost/stomp/chat');
        return sock;
      } catch (error) {
        return console.log(error);
      }
    });
    setChatMessageList([]);
    client.current.connect(
      {
        // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음.
        // ex)
        // Authorization: token,
      },
      () => {
        // callback 함수 설정, 대부분 여기에 sub 함수 씀
        try {
          client.current?.subscribe(
            `/sub/chat/public/${id}`,
            (message) => {
              setChatMessage(JSON.parse(message.body));
            },
            {
              // 여기에도 유효성 검증을 위한 header 넣어 줄 수 있음
            },
          );
        } catch (error) {
          return console.log(error);
        }
      },
    );
    setRoomId(`${id}`);
  };

  return (
    <div className="flex flex-col justify-between border-2 rounded-3xl py-4 px-5 shadow-2xl h-screen max-h-[50vh] xl:min-h-[85vh] z-[1]">
      <RightBlockHeader text={'전체 채팅'} />
      {/* 채팅내용  */}
      <div
        onMouseOut={() => handleMouseOut(-1)}
        className="space-y-4 py-4 flex-1 overflow-auto max-h-[44vh] xl:max-h-[70vh]"
      >
        {msgBox}
        <div ref={messageEndRef}></div>
      </div>
      {/* 인풋 박스  */}
      <div className="">
        <div className="flex relative">
          <input
            type="text"
            placeholder="안녕하세요^^ 인사해볼까요?"
            required
            value={inputMessage}
            onChange={handleInputMessage}
            onKeyDown={(ev) => {
              if (ev.nativeEvent.isComposing) {
              } else if (!ev.nativeEvent.isComposing && ev.key === 'Enter') {
                sendHandler();
              }
            }}
            className="overflow-visible peer border rounded-xl w-full placeholder:pl-2 py-2 mt-2 pl-3 pr-[58px] focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
          />
          <div className="absolute right-2 -bottom-[0.5px]">
            <Button
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={sendHandler}
                  className="w-6 h-6 peer-invalid:bg-gray-800 my-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
