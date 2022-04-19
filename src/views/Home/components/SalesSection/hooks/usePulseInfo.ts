import { useState } from 'react'
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
import { useSnacksBuyAmount, useSnacksBuyBackAmount } from 'hooks/useSnacksTrade'
import { useBtcUSDPrice, useEthUSDPrice } from 'utils/calls/usdPrice'
import { usePools } from 'state/pools/hooks'
import { useFarmFromPid } from 'state/farms/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

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
  const ethusdPrice = useEthUSDPrice()

  const btcsnacksPrice = useSnacksBuyAmount(
    new TokenAmount(tokens.btcsnacks, JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)),
    tokens.wbtc,
  )
  const btcusdPrice = useBtcUSDPrice()

  // TVL
  const zoinksBusdFarm = useFarmFromPid(1)

  const totalLiquidity = new BigNumber(zoinksBusdFarm.lpTotalInQuoteToken).times(zoinksBusdFarm.quoteTokenPriceBusd)

  const { pools } = usePools()

  const snacksPoolAmount = useSnacksBuyBackAmount(
    new TokenAmount(tokens.snacks, JSBI.BigInt(pools[1]?.totalStaked.gt(0) ? pools[1]?.totalStaked : 0)),
    tokens.cake,
  )

  const totalStakedUSD =
    (getBalanceNumber(
      pools[0].totalStaked.gt(0) ? pools[0].totalStaked : new BigNumber(0),
      pools[0].stakingToken.decimals,
    ) +
      parseFloat(snacksPoolAmount?.toExact() ?? '0')) *
      parseFloat(zoinksPrice?.outputAmount?.toExact() ?? '0') +
    (totalLiquidity.gt(0) ? totalLiquidity.toNumber() : 0)

  return {
    nextPulsePartAmount: bestTradePartExactIn,
    nextPulseTotalAmount: bestTradeTotalExactIn,
    snacksPrice: parseFloat(snacksPrice?.toExact() ?? '0') * parseFloat(zoinksPrice?.outputAmount?.toExact() ?? '0'),
    ethsnacksPrice: parseFloat(ethsnacksPrice?.toExact() ?? '0') * ethusdPrice,
    btcsnacksPrice: parseFloat(btcsnacksPrice?.toExact() ?? '0') * btcusdPrice,
    totalStakedUSD,
  }
}
