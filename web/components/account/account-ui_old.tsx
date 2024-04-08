'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCluster } from '../cluster/cluster-data-access';
import { useGetBalance } from './account-data-access';

export function AccountChecker() {
  const { publicKey } = useWallet();
  if (!publicKey) {
    return null;
  }
  return <AccountBalanceCheck address={publicKey} />;
}
export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster();
  const query = useGetBalance({ address });

  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data) {
    return (
      <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
        <span>
          You are connected to <strong>{cluster.name}</strong> but your account
          is not eligible.
        </span>
        <button
          className="btn btn-xs btn-neutral"
          // Here, a private message to my Telegram or email.
        >
          Request Wallet Validation
        </button>
      </div>
    );
  }
  return null;
}
