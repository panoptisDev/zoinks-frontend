import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, JSBI, Token, Trade, TokenAmount } from '@zoinks-swap/sdk'
import { Button, Box, Text } from '@zoinks-swap/uikit'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
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
import useSnacksMint from './hooks/useSnacksMint'
import { LightCard } from '../../components/Card'

export default function SnacksBuyBackCard() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const [amount, setAmount] = useState<string>()

  const parsedTokenAmount = new TokenAmount(
    tokens.snacks,
    amount ? JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )

  const {
    currencyBalances,
    redeemAmount,
    inputError: swapInputError,
  } = useSnacksBuyBackInfo(parsedTokenAmount, tokens.cake)

  const isValid = !swapInputError

  const { onCurrencySelection } = useSwapActionHandlers()

  const handleAmount = useCallback((value: string) => {
    setAmount(value) // onUserInput(Field.OUTPUT, value)
  }, [])

  const { snacksRedeem } = useSnacksMint()
  const handleSwap = async () => {
    try {
      await snacksRedeem(parsedTokenAmount?.toExact())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    onCurrencySelection(Field.INPUT, tokens.cake)
    onCurrencySelection(Field.OUTPUT, tokens.snacks)
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
                currency={tokens.snacks}
                onUserInput={handleAmount}
                onCurrencySelect={() => console.log('input currency select')}
                otherCurrency={tokens.cake}
                disableCurrencySelect={!false}
                onlyInteger={!false}
                id="swap-currency-input"
              />

              <CurrencyInputPanel
                value={redeemAmount?.toExact()}
                onUserInput={() => console.log('redeem amount')}
                label={t('To')}
                showMaxButton={false}
                currency={tokens.cake}
                onCurrencySelect={() => console.log('output currency select')}
                otherCurrency={tokens.snacks}
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
                  {t('Claim')}
                </Button>
              )}
            </Box>
          </Wrapper>
          <LightCard>
            <Text fontSize="14px" style={{ textAlign: 'center' }}>
              <span role="img" aria-label="pancake-icon">
                🥞
              </span>{' '}
              {t('You can only claim WHOLE snacks not partial. There are 10% claim fees')}
            </Text>
          </LightCard>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
