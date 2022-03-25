import { useCallback } from 'react'
import { zoinksMint } from 'utils/calls'
import { useZoinksContract } from 'hooks/useContract'

const useZoinksMint = () => {
  const zoinksContract = useZoinksContract()

  const handleMint = useCallback(
    async (amount: string) => {
      const txHash = await zoinksMint(zoinksContract, amount)
      console.info(txHash)
    },
    [zoinksContract],
  )

  return { zoinksMint: handleMint }
}

export default useZoinksMint
