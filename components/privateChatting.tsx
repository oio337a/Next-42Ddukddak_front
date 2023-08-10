/* eslint-disable @typescript-eslint/no-use-before-define */
import dynamic from 'next/dynamic';

import { useContext, useEffect, useRef, useState } from 'react';
import { CompatClient, Stomp } from '@stomp/stompjs';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { AppContext, ModalContext } from '@/pages';
import { IChatDetail } from '@/interface/ChatDetail';
import { IText } from '@/interface/Modal';
import useHandleInputMessage from '@/libs/inputMessage';
import getCookieValue from '@/libs/getCookieValue';
import { cls } from '@/libs/utils';
import { formatTime } from '@/libs/formatTime';
import useHandleMouseIndex from '@/libs/mouseIndex';
import * as modalMessage from '@/const/modalMessage';
import { Message } from '@/const/message';
const Modal = dynamic(import('./modal'));
const Button = dynamic(import('./button'));

interface IMypageProps {
  mypage?: boolean;
  showReservation?: number;
}

interface IChangeValues {
  remainingTime?: number;
  participantsNum: number;
}

export default function PrivateChatting({ mypage, showReservation }: IMypageProps) {
  const client = useRef<CompatClient>();
  const [chatMessage, setChatMessage] = useState<IChatDetail>();
  const [chatMessageList, setChatMessageList] = useState<IChatDetail[]>([]);
  const { inputMessage, handleInputMessage, handleDeleteInputMessage } = useHandleInputMessage();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useContext(AppContext);
  const intraId = getCookieValue('intraId');
  const [changeValues, setChangeValues] = useState<IChangeValues>({ participantsNum: 1 });
  const [roomIsGone, setRoomIsGone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useContext(ModalContext);
  const [text, setText] = useState<IText>();
  const [type, setType] = useState<string>('');
  const [hostLeave, setHostLeave] = useState(false);
  const [reservedTime, setReservedTime] = useState<boolean>(false);
  const [reservedChatMessageList, setReservedChatMessageList] = useState<IChatDetail[]>([]);
  const [hostReserved, serHostReserved] = useState<string | undefined>();
  const { mouseOnIndex, handleMouseOut, handleMouseOver } = useHandleMouseIndex();

  // 방장이 예약하면 참가자들에게 모달 띄우기
  useEffect(() => {
    if (!mypage && hostReserved) {
      if (confirm(`${hostReserved}에 방장이 뚝딱을 신청했어요.`)) {
        // 확인시 api 요청
      } else {
        // 거절시 api 요청
      }
    }
  }, [hostReserved]);

  // 새로운 채팅 메세지 도착시 포커스 맨 밑으로
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessageList]);

  // 채팅 메세지가 도착하면 변동값 (방인원, 방 남은 시간) 새로고침
  useEffect(() => {
    if (chatMessage) {
      setChatMessageList([...chatMessageList, chatMessage]);
      setChangeValues({
        remainingTime: chatMessage.remainingTime,
        participantsNum: chatMessage.participantsNum,
      });
    }
  }, [chatMessage]);

  // mypage일 때 예약된 채팅 내역 불러오기
  useEffect(() => {
    if (mypage && showReservation !== -1) {
      const fetchReservedChatMessages = async () => {
        await axios.get(`/api/reserved/${showReservation}/chat-message`).then((res) => {
          console.log('reservedChatMessages');
          setReservedChatMessageList(res.data);
        });
      };
      fetchReservedChatMessages();
    }
  }, [showReservation]);

  // 새로 들어온 사람 기존 방 채팅 내역 가져오기
  const loadChattingMessage = async () => {
    try {
      await axios.get(`/api/chat/private/${info.roomInfo?.roomId}`).then((response) => {
        if (response.data.message) {
          setChatMessageList(response.data);
        }
        setChangeValues({
          remainingTime: response.data.remainingTime,
          participantsNum: response.data.participantsNum,
        });
      });
    } catch (err) {
      console.log('private chatting get', err);
    }
  };

  // 방에 처음 들어오면 소켓연결, 채팅 내역가져오기
  useEffect(() => {
    if (info.roomInfo?.roomId) {
      connectHandler(info.roomInfo?.roomId);
      loadChattingMessage();
    }
  }, [info.roomInfo]);

  // 방장이 방을 떠났을 때 폭파
  useEffect(() => {
    if (roomIsGone) {
      if (hostLeave) {
        alert(Message.HOSTLEAVE);
      } else {
        alert(Message.ROOM_DESTROYED);
      }
      setInfo({
        ddukddak: false,
        context: false,
        roomInfo: undefined,
      });
    }
  }, [roomIsGone]);

  // @@@@ 방장 떠났을 때
  const requestDestroy = async () => {
    try {
      await axios.post(`/api/chat/private/${info.roomInfo?.roomId}/destroy`, `${info.roomInfo?.roomId}`).then(() => {
        setIsConfirm({ isConfirm: false });
        setIsOpen(false);
      });
    } catch (err) {
      console.log('requestDestroy err: ', err);
    }
  };

  // @@@@ 예약 확정
  const requestReservation = async () => {
    console.log('reservedTime: ', isConfirm.reservedTime);
    try {
      await axios
        .post(`/api/reserved/${info.roomInfo?.roomId}`, null, {
          params: { reservedTime: isConfirm.reservedTime },
        })
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          res.status === 200 ? alert(Message.SUCCESS_RESERVATION) : alert(Message.FAILED_RESERVATION);
        })
        .then(() => {
          setIsConfirm({ isConfirm: false });
          setIsOpen(false);
          setReservedTime(false);
        });
    } catch (err) {
      console.log('requestReservation err: ', err);
    }
  };

  // 유저가 방 떠나기
  const requestLeave = async () => {
    try {
      await axios
        .post(`/api/chat/private/${info.roomInfo?.roomId}/leave`, null, { params: { intraId: intraId } })
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          res.status === 200
            ? setInfo({
                ddukddak: false,
                context: false,
                roomInfo: undefined,
              })
            : console.log('leave 실패');
        })
        .then(() => {
          setIsConfirm({ isConfirm: false });
          setIsOpen(false);
        });
    } catch (err) {
      console.log('request Leave: ', err);
    }
  };

  // modal 반응 함수 (방장이 방떠남, 예약확정) @@@@
  useEffect(() => {
    if (isConfirm.isConfirm) {
      if (type === 'hostLeave') {
        requestDestroy();
      } else if (type === 'reservation') {
        requestReservation();
      } else if (type === 'guest') {
        requestLeave();
      }
    }
  }, [isConfirm.isConfirm]);

  // 'leave' button 클릭 이벤트
  const onLeave = async () => {
    if (info.roomInfo?.login === intraId) {
      setType('hostLeave');
      setText({
        title: modalMessage.default.HOSTLEAVE.title,
        subText: modalMessage.default.HOSTLEAVE.subText,
      });
      setIsOpen(true);
    } else {
      setType('guest');
      setText({ title: modalMessage.default.LEAVE.title, subText: modalMessage.default.LEAVE.subText });
      setIsOpen(true);
    }
  };

  // '뚝딱뚝딱' button 클릭 이벤트 예약 확정
  const onReservation = () => {
    if (changeValues.participantsNum > 1) {
      setType('reservation');
      setReservedTime(true);
      setText({
        title: modalMessage.default.RESERVATION.title,
        subText: `${info.roomInfo?.roomName} ${modalMessage.default.RESERVATION.subText}`,
      });
      setIsOpen(true);
    } else {
      alert('혼자일때 예약해서 뭐하게 임마~~!!');
    }
  };

  // 채팅 메시지 보내기
  const sendHandler = () => {
    if (inputMessage) {
      try {
        client.current?.send(
          '/pub/chat/message/private',
          {},
          JSON.stringify({
            roomId: info.roomInfo?.roomId,
            sender: intraId,
            message: inputMessage,
          }),
        );
      } catch (error) {
        console.log('send', error);
      }
      handleDeleteInputMessage();
    }
  };

  // 서버와 소켓 연결하기
  const connectHandler = (id: number) => {
    client.current = Stomp.over(() => {
      try {
        const sock = new SockJS('http://localhost/stomp/chat');
        return sock;
      } catch (error) {
        return console.log('SockJS', error);
      }
    });
    setChatMessageList([]);
    client.current.connect(
      {
        // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음.
        // ex)
        // Authorization: token,
      },
      // eslint-disable-next-line consistent-return
      () => {
        try {
          client.current?.subscribe(
            `/sub/chat/room/${id}`,
            (message) => {
              if (message.body === '"OK"') {
                setHostLeave(true);
                setRoomIsGone(true);
              } else if (message.body === '1001') {
                alert(Message.THREE_MINUTE_LEFT);
              } else if (message.body === '1002') {
                setRoomIsGone(true);
              } else if (message.body === '1003') {
                console.log('message가 뭘로 들어오나요??', message.body);
              } else {
                setChatMessage(JSON.parse(message.body));
              }
            },
            {
              // 여기에도 유효성 검증을 위한 header 넣어 줄 수 있음
            },
          );
        } catch (error) {
          return console.log('sub', error);
        }
      },
    );
  };

  // 전달 받은 메세지 뿌려줄 박스
  const msgBox = chatMessageList.map((item, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <div onMouseOver={() => handleMouseOver(idx)} key={idx}>
      <div className={cls(item.sender === intraId ? 'items-end' : '', 'flex flex-col justify-end pr-4')}>
        <div className={cls(item.sender === intraId ? '' : 'flex-row-reverse', 'flex justify-end items-end')}>
          <span className="text-sm text-gray-600 font-light px-2">{formatTime(item.time)} </span>
          <div className="px-2 py-2  border border-gray-300 rounded-xl bg-violet-300 text-white">
            <p>{item.message}</p>
          </div>
        </div>
        {item.sender !== intraId && mouseOnIndex === idx ? (
          <span className="text-xs text-gray-600 mr-1">신고</span>
        ) : null}
      </div>
    </div>
  ));

  // mypage 에 예약 message 박스
  const reservedMsgBox = reservedChatMessageList.map((item, idx) => (
    <div onMouseOver={() => handleMouseOver(idx)} key={idx}>
      <div className={cls(item.sender === intraId ? 'items-end' : '', 'flex flex-col justify-end pr-4')}>
        <div className={cls(item.sender === intraId ? '' : 'flex-row-reverse', 'flex justify-end items-end')}>
          <span className="text-sm text-gray-600 font-light px-2">{formatTime(item.time)} </span>
          <div className="px-2 py-2  border border-gray-300 rounded-xl bg-violet-300 text-white">
            <p>{item.message}</p>
          </div>
        </div>
        {item.sender !== intraId && mouseOnIndex === idx ? (
          <span className="text-xs text-gray-600 mr-1">신고</span>
        ) : null}
      </div>
    </div>
  ));

  return (
    <div className="xl:col-span-2 flex flex-col justify-between border-2 rounded-3xl shadow-xl px-5 py-4 space-y-2 h-screen max-h-[50vh] xl:min-h-[85vh] bg-indigo-300">
      {isOpen ? (
        <Modal title={text?.title} subText={text?.subText} setIsOpen={setIsOpen} setTime={reservedTime} />
      ) : null}
      {/* 상단 바 */}
      {mypage ? null : (
        <div className="border rounded-full bg-white shadow-md flex justify-between items-center">
          <div className="flex flex-col pl-5">
            <div className="flex space-x-2">
              <h3 className="text-lg text-gray-800 font-bold">{info.roomInfo?.roomName}</h3>
              <div className="flex self-center space-x-1 justify-center items-center border rounded-full px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                <span className="text-gray-500 text-sm self-center">
                  {changeValues?.participantsNum || info.roomInfo?.participantsNum}
                </span>
              </div>
            </div>
            <span className="text-gray-400 text-sm">
              방 폭파까지 {changeValues?.remainingTime || info.roomInfo?.remainingTime}분 남았습니다.
            </span>
          </div>
          <div className=" font-bold flex justify-center items-center space-x-2 mr-2">
            {info.roomInfo?.login === intraId ? (
              <div className="flex justify-center items-center space-x-2">
                <button onClick={onReservation} type="button" className=" hover:text-violet-500 transition-colors">
                  뚝딱뚝딱
                </button>
                <div className="w-[2px] h-6 bg-black" />
              </div>
            ) : null}
            <button onClick={onLeave} type="button" className="hover:text-violet-500 transition-colors">
              Leave
            </button>
          </div>
        </div>
      )}
      {/* 채팅 내용 */}
      <div
        onMouseOut={() => handleMouseOut(-1)}
        className="space-y-4 flex-1 py-4 overflow-auto xl:min-h-[69vh] max-h-[50vh]"
      >
        {mypage && showReservation !== -1 ? reservedMsgBox : msgBox}
        <div ref={messageEndRef} />
      </div>
      {/* input 박스 */}
      {mypage ? null : (
        <div className="">
          <div className="flex relative">
            <input
              type="text"
              placeholder="Message"
              required
              value={inputMessage}
              onChange={handleInputMessage}
              onKeyDown={(ev) => {
                if (ev.nativeEvent.isComposing) {
                  /* empty */
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
      )}
    </div>
  );
}
