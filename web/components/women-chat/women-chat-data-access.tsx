'use client';

import { WomenChatIDL, getWomenChatProgramId } from '@women-chat/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useWomenChatProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getWomenChatProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(WomenChatIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['women-chat', 'all', { cluster }],
    queryFn: () => program.account.womenChat.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['women-chat', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ womenChat: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useWomenChatProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useWomenChatProgram();

  const accountQuery = useQuery({
    queryKey: ['women-chat', 'fetch', { cluster, account }],
    queryFn: () => program.account.womenChat.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['women-chat', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ womenChat: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['women-chat', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ womenChat: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['women-chat', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ womenChat: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['women-chat', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ womenChat: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

 
}
