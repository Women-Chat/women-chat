'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero } from '../ui/ui-layout';
import { WalletButton } from '../solana/solana-provider';

export default function WomenChatFeature() {
  const { publicKey } = useWallet();

  return publicKey ? (
    <div>
      <AppHero title="Women-Chat" subtitle={"Let's connect"}></AppHero>
    </div>
  ) : (
    <WalletButton></WalletButton>
  );
}
