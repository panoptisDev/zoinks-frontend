import { useCallback } from 'react'
import { snacksBuy, snacksRedeem } from 'utils/calls'
import { useSnacksContract } from 'hooks/useContract'

const useSnacksMint = () => {
  const snacksContract = useSnacksContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await snacksBuy(snacksContract, amount)
      console.info(txHash)
    },
    [snacksContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await snacksRedeem(snacksContract, amount)
      console.info(txHash)
    },
    [snacksContract],
  )

  return { snacksBuy: handleBuy, snacksRedeem: handleRedeem }
}

export default useSnacksMint
