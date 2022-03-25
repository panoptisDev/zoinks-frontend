import { useCallback } from 'react'
import { snacksBuy, snacksRedeem } from 'utils/calls'
import { useBtcSnacksContract } from 'hooks/useContract'

const useBtcSnacksMint = () => {
  const btcsnacksContract = useBtcSnacksContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await snacksBuy(btcsnacksContract, amount)
    },
    [btcsnacksContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await snacksRedeem(btcsnacksContract, amount)
    },
    [btcsnacksContract],
  )

  return { btcsnacksBuy: handleBuy, btcsnacksRedeem: handleRedeem }
}

export default useBtcSnacksMint
