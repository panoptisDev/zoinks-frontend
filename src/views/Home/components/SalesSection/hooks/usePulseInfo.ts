import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@zoinks-swap/sdk'
import { parseUnits } from '@ethersproject/units'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useTokenBalances, useCurrencyBalances } from 'state/wallet/hooks'
import tokens from 'config/constants/tokens'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPulseAddress } from 'utils/addressHelpers'
import { useSnacksBuyBackInfo, tryParseAmount } from 'state/swap/hooks'
import { useSnacksBuyAmount } from 'hooks/useSnacksTrade'
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
  const pulsePartAmount =
    parseFloat(zoinksConvertAmount?.toExact() ?? '0') + parseFloat(redeemPartAmount?.toExact() ?? '0')

  const pulseTotalAmount = parseFloat(zoinksBalance?.toExact() ?? '0') + parseFloat(redeemTotalAmount?.toExact() ?? '0')

  const parsedPartAmount = tryParseAmount(pulsePartAmount.toString(), tokens.cake)
  const parsedTotalAmount = tryParseAmount(pulseTotalAmount.toString(), tokens.cake)

  const bestTradePartExactIn = useTradeExactIn(parsedPartAmount, tokens.busd)
  const bestTradeTotalExactIn = useTradeExactIn(parsedTotalAmount, tokens.busd)

  const snacksPrice = useSnacksBuyAmount(
    new TokenAmount(tokens.snacks, JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)),
    tokens.cake,
  )
  const zoinksAmount = tryParseAmount('1', tokens.cake)
  const zoinksPrice = useTradeExactIn(zoinksAmount, tokens.busd)

  const ethsnacksPrice = useSnacksBuyAmount(
    new TokenAmount(tokens.ethsnacks, JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)),
    tokens.weth,
  )
  const btcsnacksPrice = useSnacksBuyAmount(
    new TokenAmount(tokens.btcsnacks, JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)),
    tokens.wbtc,
  )

  return {
    nextPulsePartAmount: bestTradePartExactIn,
    nextPulseTotalAmount: bestTradeTotalExactIn,
    snacksPrice: parseFloat(snacksPrice?.toExact() ?? '0') * parseFloat(zoinksPrice?.outputAmount?.toExact() ?? '0'),
    ethsnacksPrice,
    btcsnacksPrice,
  }
}
