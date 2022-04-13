import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@zoinks-swap/sdk'
import { parseUnits } from '@ethersproject/units'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useTokenBalances, useCurrencyBalances } from 'state/wallet/hooks'
import tokens from 'config/constants/tokens'
import { getPulseAddress } from 'utils/addressHelpers'
import { useSnacksBuyBackInfo, tryParseAmount } from 'state/swap/hooks'
import { useSnacksBuyBackAmount } from 'hooks/useSnacksTrade'
import { ethers } from 'ethers'

// from the current swap inputs, compute the best trade and return it.
export function usePulseInfo() {
  const addr = getPulseAddress()

  const relevantTokenBalances = useTokenBalances(addr, [tokens.cake, tokens.snacks])

  const zoinksBalance = relevantTokenBalances[tokens.cake.address]
  const snacksBalance = relevantTokenBalances[tokens.snacks.address]

  const snacksConvertAmount = new TokenAmount(
    tokens.snacks,
    JSBI.divide(snacksBalance?.raw ?? JSBI.BigInt(0), JSBI.BigInt(10)),
  )
  const zoinksConvertAmount = new TokenAmount(
    tokens.cake,
    JSBI.divide(zoinksBalance?.raw ?? JSBI.BigInt(0), JSBI.BigInt(10)),
  )

  const { redeemAmount: redeemPartAmount } = useSnacksBuyBackInfo(snacksConvertAmount, tokens.cake)

  const { redeemAmount: redeemTotalAmount } = useSnacksBuyBackInfo(snacksConvertAmount, tokens.cake)

  const pulsePartAmount = JSBI.add(
    zoinksConvertAmount?.raw ? JSBI.BigInt(zoinksConvertAmount?.toExact()) : JSBI.BigInt(0),
    redeemPartAmount?.raw ? JSBI.BigInt(redeemPartAmount?.toExact()) : JSBI.BigInt(0),
  ).toString()

  const pulseTotalAmount = JSBI.add(
    zoinksBalance?.raw ? JSBI.BigInt(zoinksBalance?.toExact()) : JSBI.BigInt(0),
    redeemTotalAmount?.raw ? JSBI.BigInt(redeemTotalAmount?.toExact()) : JSBI.BigInt(0),
  ).toString()

  const parsedPartAmount = tryParseAmount(pulsePartAmount, tokens.cake)
  const parsedTotalAmount = tryParseAmount(pulseTotalAmount, tokens.cake)

  const bestTradePartExactIn = useTradeExactIn(parsedPartAmount, tokens.busd)
  const bestTradeTotalExactIn = useTradeExactIn(parsedTotalAmount, tokens.busd)

  return {
    nextPulsePartAmount: bestTradePartExactIn,
    nextPulseTotalAmount: bestTradeTotalExactIn,
  }
}
