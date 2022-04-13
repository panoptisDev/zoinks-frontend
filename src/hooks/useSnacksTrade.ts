import { Token, TokenAmount, CurrencyAmount } from '@zoinks-swap/sdk'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useSnacksTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useSnacksBuyAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const contract = useSnacksTokenContract(tokenAmount?.token?.address, false)
  const value = new BigNumber(tokenAmount?.toExact()).times(DEFAULT_TOKEN_DECIMAL).toString()

  const inputs = [value]
  const requireAmount = useSingleCallResult(contract, 'calculateBuyAmount', inputs).result

  return useMemo(
    () => (requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined),
    [token1, requireAmount],
  )
}

export function useSnacksBuyBackAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const contract = useSnacksTokenContract(tokenAmount?.token?.address, false)
  const value = new BigNumber(tokenAmount?.toExact()).times(DEFAULT_TOKEN_DECIMAL).toString()

  const inputs = [value]
  const requireAmount = useSingleCallResult(contract, 'calculateRedeemAmount', inputs).result

  return useMemo(
    () => (requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined),
    [token1, requireAmount],
  )
}
