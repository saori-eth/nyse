import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  TokenAmount,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

const SLIPPAGE = 0.25;
export const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTokenDecimals = async (
  connection: Connection,
  mintAddress: string
): Promise<number> => {
  const mintPublicKey = new PublicKey(mintAddress);
  const tokenAccountInfo = await connection.getParsedAccountInfo(mintPublicKey);

  // Check if the data is parsed and contains the expected structure
  if (
    tokenAccountInfo.value &&
    typeof tokenAccountInfo.value.data === "object" &&
    "parsed" in tokenAccountInfo.value.data
  ) {
    const parsedInfo = tokenAccountInfo.value.data.parsed?.info;
    if (parsedInfo && typeof parsedInfo.decimals === "number") {
      return parsedInfo.decimals;
    }
  }

  throw new Error("Unable to fetch token decimals");
};

export const getQuote = async (
  connection: Connection,
  baseToken: string,
  outputToken: string,
  amount: number
): Promise<any> => {
  const decimals = await getTokenDecimals(connection, baseToken);
  const adjustedAmount = amount * 10 ** decimals;

  const quoteResponse = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${baseToken}&outputMint=${outputToken}&amount=${adjustedAmount}&slippageBps=50`
  );
  const swapTransaction = await quoteResponse.json();
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  return new Uint8Array(swapTransactionBuf);
};
