import dynamic from 'next/dynamic';

import { useState } from 'react';
const JoinedDdukddak = dynamic(import('@/components/joinedDdukddak'));
const Layout = dynamic(import('@/components/layout'));
const PrivateChatting = dynamic(import('@/components/privateChatting'));
const PublicChatting = dynamic(import('@/components/publicChatting'));

export default function Mypage() {
  const [showReservation, setShowReservation] = useState<number>(-1);
  return (
    <Layout>
      <div className="grid gap-4 py-20 px-8 xl:grid-cols-3 h-screen">
        <JoinedDdukddak setIndex={setShowReservation} />
        {/* <PrivateChatting mypage showReservation={showReservation} /> */}
        <PublicChatting />
      </div>
    </Layout>
  );
}
