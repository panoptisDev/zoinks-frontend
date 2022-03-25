import { useCallback } from 'react'
import { snacksBuy, snacksRedeem } from 'utils/calls/snacksMint'
import { useEthSnacksContract } from 'hooks/useContract'

const useEthSnacksMint = () => {
  const ethsnacksContract = useEthSnacksContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await snacksBuy(ethsnacksContract, amount)
      console.info(txHash)
    },
    [ethsnacksContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await snacksRedeem(ethsnacksContract, amount)
      console.info(txHash)
    },
    [ethsnacksContract],
  )

  return { ethsnacksBuy: handleBuy, ethsnacksRedeem: handleRedeem }
}

export default useEthSnacksMint
