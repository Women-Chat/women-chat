'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import {
  PublicKey,
} from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

export function useGetBalance({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ['get-balance', { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => connection.getBalance(address),
  });
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: [
      'get-token-accounts',
      { endpoint: connection.rpcEndpoint, address },
    ],
    queryFn: async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          
        }),
        connection.getParsedTokenAccountsByOwner(address, {
         
        }),
      ]);
      return [...tokenAccounts.value, ...token2022Accounts.value];
    },
  });
}




