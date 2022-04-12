import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, JSBI, Token, Trade, TokenAmount } from '@zoinks-swap/sdk'
import { Button, Box } from '@zoinks-swap/uikit'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import Column, { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { Wrapper } from './components/styleds'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/swap/actions'
import { useSnacksBuyBackInfo, useSwapActionHandlers, useSwapState, tryParseAmount } from '../../state/swap/hooks'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import useBtcSnacksMint from './hooks/useBtcSnacksMint'

export default function SnacksBuyBackCard() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const [amount, setAmount] = useState<string>()

  const parsedTokenAmount = new TokenAmount(tokens.btcsnacks, amount ? JSBI.BigInt(amount) : '0')

  const {
    currencyBalances,
    redeemAmount,
    inputError: swapInputError,
  } = useSnacksBuyBackInfo(parsedTokenAmount, tokens.wbtc)

  const isValid = !swapInputError

  const { onCurrencySelection } = useSwapActionHandlers()

  const handleAmount = useCallback((value: string) => {
    setAmount(value)
  }, [])

  const { btcsnacksRedeem } = useBtcSnacksMint()
  const handleSwap = async () => {
    try {
      await btcsnacksRedeem(parsedTokenAmount?.toExact())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    onCurrencySelection(Field.INPUT, tokens.wbtc)
    onCurrencySelection(Field.OUTPUT, tokens.btcsnacks)
  }, [onCurrencySelection])

  return (
    <StyledSwapContainer $isChartExpanded={false}>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <CurrencyInputHeader title={t('Snacks Buy Back')} subtitle={t('Redeem Snacks in an instant')} />
          <Wrapper id="swap-page">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={t('From (estimated)')}
                value={amount}
                showMaxButton={false}
                currency={tokens.btcsnacks}
                onUserInput={handleAmount}
                onCurrencySelect={() => console.log('input currency select')}
                otherCurrency={tokens.wbtc}
                disableCurrencySelect={!false}
                onlyInteger={!false}
                id="swap-currency-input"
              />

              <CurrencyInputPanel
                value={redeemAmount?.toExact()}
                onUserInput={() => console.log('redeem amount')}
                label={t('To')}
                showMaxButton={false}
                currency={tokens.wbtc}
                onCurrencySelect={() => console.log('output currency select')}
                otherCurrency={tokens.btcsnacks}
                disableCurrencySelect={!false}
                id="swap-currency-output"
              />
            </AutoColumn>
            <Box mt="1rem">
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSwap()
                  }}
                  id="swap-button"
                  width="100%"
                  disabled={!isValid}
                >
                  {t('Swap')}
                </Button>
              )}
            </Box>
          </Wrapper>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
