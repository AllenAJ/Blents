// app/api/actions/scroll-payment/route.ts
import {
    ActionPostResponse,
    ActionPostRequest,
    createActionHeaders,
  } from "@solana/actions";
  import { ethers } from "ethers";
  
  const headers = createActionHeaders({
    chainId: "mainnet",
    actionVersion: "2.2.1",
  });
  
  export const GET = async (req: Request) => {
    try {
      const requestUrl = new URL(req.url);
      const { toAddress } = validatedQueryParams(requestUrl);
      const baseHref = new URL(
        `/api/actions/scroll-payment?to=${toAddress}`,
        requestUrl.origin,
      ).toString();
  
      const payload = {
        isEthereum: true,
        chain: "0x" + BigInt(534352).toString(16),
        type: "action",
        title: "Send payment via Scroll",
        icon: "https://scroll.io/logo.png",
        description: "Send ETH on Scroll L2",
        label: "Transfer",
        links: {
          actions: [
            {
              label: "Send ETH",
              href: `${baseHref}&amount={amount}`,
              parameters: [
                {
                  name: "amount",
                  label: "Amount in ETH",
                  required: true,
                },
              ],
            },
          ],
        },
      };
  
      return Response.json(payload, { headers });
    } catch (err) {
      console.error(err);
      return new Response("Error occurred", { status: 400, headers });
    }
  };
  
  export const POST = async (req: Request) => {
    try {
      const requestUrl = new URL(req.url);
      const { amount, toAddress } = validatedQueryParams(requestUrl);
      const body: ActionPostRequest = await req.json();
      
      const fromAddress = body.account;
      const provider = new ethers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
      
      const nonce = await provider.getTransactionCount(fromAddress, "pending");
      const feeData = await provider.getFeeData();
      const gasLimit = await provider.estimateGas({
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        from: fromAddress,
      });
  
      const transaction = {
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        gasPrice: feeData.gasPrice,
        gasLimit: gasLimit,
        nonce: nonce,
        chainId: (await provider.getNetwork()).chainId,
        data: "0x",
      };
  
      const serializedTx = ethers.Transaction.from(transaction).unsignedSerialized;
  
      return Response.json({
        transaction: serializedTx,
        message: `Sending ${amount} ETH to ${toAddress}`,
      }, { headers });
    } catch (err) {
      console.error(err);
      return new Response("Error occurred", { status: 400, headers });
    }
  };
  
  function validatedQueryParams(requestUrl: URL) {
    const toAddress = requestUrl.searchParams.get("to") ?? "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    const amount = parseFloat(requestUrl.searchParams.get("amount") ?? "0.0001");
    
    if (amount <= 0) throw "Invalid amount";
    
    return { amount, toAddress };
  }
  
  export const OPTIONS = async () => new Response(null, { headers });