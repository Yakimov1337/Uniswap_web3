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

function Exchange() {
  const isApproving = isOperationPending('approve'); //TO DO
  const isSwapping = isOperationPending('swap'); //TO DO

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
          className={"canApprove" ? "bg-site-pink text-white" : "bg-site-dim2 text-site-dim-2" `${styles.actionButton}`}>
          {isApproving ? "Approving..." : "Approve"}
        </button>
      ) :
        <button
          disabled={!"canSwap"}
          onClick={() => { }}
          className={"canSwap" ? "bg-site-pink text-white" : "bg-site-dim2 text-site-dim-2" `${styles.actionButton}`}>
          {isSwapping ? "Swapping..." : "hasEnoughBalance" ? "Swap" : "Insufficient balance"}
        </button>
      }
    </div>
  )
}

export default Exchange