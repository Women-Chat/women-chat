import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCluster } from '../cluster/cluster-data-access';
import { useGetTokenAccounts } from './account-data-access';

const desiredNFTMint = new PublicKey('So11111111111111111111111111111111111111111');


export function AccountChecker() {
  const { publicKey } = useWallet();
  if (!publicKey) {
    return null;
  }
  return <AccountBalanceCheck address={publicKey} />;
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster();
  const query = useGetTokenAccounts({ address });

  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data || !hasDesiredNFT(query.data)) {
    return (
      <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
        <span>
          You are connected to <strong>{cluster.name}</strong> but your account
          does not have the desired NFT.
        </span>
        <button
          className="btn btn-xs btn-neutral"
          // aqui un mensaje privado a mi telegram o mail.
          // Here, a private message to my Telegram or email.
        >
          Request NFT Validation
        </button>
      </div>
    );
  }
  return null;
}

function hasDesiredNFT(data) {
  return data.some(({ account }) => {
    const tokenAmount = account.data.parsed.info.tokenAmount;
    return tokenAmount.mint.equals(desiredNFTMint) && tokenAmount.uiAmount > 0;
  });
}
