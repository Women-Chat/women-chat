import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { WomenChat } from '../target/types/women_chat';

describe('women-chat', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.WomenChat as Program<WomenChat>;

  const womenChatKeypair = Keypair.generate();

  it('Initialize WomenChat', async () => {
    await program.methods
      .initialize()
      .accounts({
        womenChat: womenChatKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([womenChatKeypair])
      .rpc();

    const currentCount = await program.account.womenChat.fetch(
      womenChatKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment WomenChat', async () => {
    await program.methods
      .increment()
      .accounts({ womenChat: womenChatKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.womenChat.fetch(
      womenChatKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment WomenChat Again', async () => {
    await program.methods
      .increment()
      .accounts({ womenChat: womenChatKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.womenChat.fetch(
      womenChatKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement WomenChat', async () => {
    await program.methods
      .decrement()
      .accounts({ womenChat: womenChatKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.womenChat.fetch(
      womenChatKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set womenChat value', async () => {
    await program.methods
      .set(42)
      .accounts({ womenChat: womenChatKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.womenChat.fetch(
      womenChatKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the womenChat account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        womenChat: womenChatKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.womenChat.fetchNullable(
      womenChatKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
