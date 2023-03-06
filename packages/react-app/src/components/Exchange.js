import React, { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { abis } from "@my-app/contracts";
import { ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import { getAvailableTokens, getCounterpartTokens, findPoolByTokens, isOperationPending, getFailureMessage, getSuccessMessage } from "../utils";
import { ROUTER_ADDRESS } from "../config";
import { AmountIn, AmountOut, Balance } from "./";
import styles from "../styles";

function Exchange({pools}) {
  const {account} = useEthers();
  const [fromValue, setFromValue] = useState("0");
  const [fromToken, setFromTokn] = useState(pools[0].token0Address);
  const [toToken,setToToken] = useState("");
  const [resetState, setResetState] = useState(false);

  const fromValueBigNumber = parseUnits(fromValue);
  const availableTOkens = getAvailableTokens(pools);
  const counterpartTokens = getCounterpartTokens(pools,fromToken);
  const pairAddress = findPoolByTokens(pools,fromToken,toToken)?.address ?? "";

  const routerContract = new Contract(ROUTER_ADDRESS,abis.router02);
  const fromTokenContract = new Contract(fromToken, ERC20.abi);
  const fromTokenBalance = useTokenBalance(fromToken,account);
  const tokenAllowance = useTokenAllowance(fromToken,account,ROUTER_ADDRESS) || parseUnits("0");
  const approveNeeded = fromValueBigNumber.gt(tokenAllowance);
  const fromValueIsGreatThan0 = fromValueBigNumber.gt(parseUnits("0"));
  const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance ?? parseUnits("0"));

  const {state: swapApproveState, send: swapApproveSend} = useContractFunction(fromTokenContract,"approve",{
    transactionName: "onApproveRequest",
    gasLimitBufferPercentage: 10,
  });

  const {state: swapExecuteState, send: swapExecuteSend} = useContractFunction(routerContract,"swapExactTokensForTokens",{
    transactionName: "swapExactTokensForTokens",
    gasLimitBufferPercentage: 10,
  });


  const isApproving = isOperationPending(swapApproveState); 
  const isSwapping = isOperationPending(swapExecuteState);

  // const successMessage = getSuccessMessage(); //TO DO
  // const failureMessage = getFailureMessage(); //TO DO


  return (
    <div className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountOut />
        <Balance />
      </div>
      <div className="mb-8 w-[100%]">
        <AmountOut />
        <Balance />
      </div>

      {'approveNeeded' && !isSwapping ? (
        <button
          disabled={!"canApprove"}
          onClick={() => { }}
          className={
            `${"canApprove"
              ? "bg-site-pink text-white"
              : "bg-site-dim2 text-site-dim-2"
            }    ${styles.actionButton}`
          }
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      ) :
        <button
          disabled={!"canSwap"}
          onClick={() => { }}
          className={
            `${"canSwap"
              ? "bg-site-pink text-white"
              : "bg-site-dim2 text-site-dim-2"
            }    ${styles.actionButton}`
          }
        >
          {isSwapping ? "Swapping..." : "hasEnoughBalance" ? "Swap" : "Insufficient balance"}
        </button>
      }

      {"failureMessage" && !"resetState" ?
        (
          <p className={styles.message}>{"failureMessage"}</p>
        ) : "successMessage" ?
          (
            <p className={styles.message}>{"successMessage"}</p>
          ) : ""}
    </div>
  )
}

export default Exchange