import { useState } from 'react';
import JoinedDdukddak from '@/components/joinedDdukddak';
import Layout from '@/components/layout';
import PrivateChatting from '@/components/privateChatting';
import PublicChatting from '@/components/publicChatting';

export default function Mypage() {
  const [showReservation, setShowReservation] = useState<number>(-1);
  return (
    <Layout>
      <div className="grid gap-4 py-20 px-8 xl:grid-cols-3 h-screen">
        <JoinedDdukddak setIndex={setShowReservation} />
        <PrivateChatting mypage showReservation={showReservation} />
        {/* <PublicChatting /> */}
      </div>
    </Layout>
  );
}
