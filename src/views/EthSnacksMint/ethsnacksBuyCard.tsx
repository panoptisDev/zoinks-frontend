import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, JSBI, Token, Trade, TokenAmount } from '@zoinks-swap/sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex, IconButton, ArrowUpDownIcon } from '@zoinks-swap/uikit'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import Column, { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { Field } from '../../state/swap/actions'
import { useSnacksBuyInfo, useSwapActionHandlers, useSwapState, tryParseAmount } from '../../state/swap/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import useEthSnacksMint from './hooks/useEthSnacksMint'
import { LightCard } from '../../components/Card'

export default function EthSnacksBuyCard() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const [amount, setAmount] = useState<string>()

  const parsedTokenAmount = new TokenAmount(tokens.ethsnacks, amount ? JSBI.BigInt(amount) : '0')

  const {
    currencyBalances,
    requiredAmount,
    inputError: swapInputError,
  } = useSnacksBuyInfo(parsedTokenAmount, tokens.weth)

  const isValid = !swapInputError

  const { onCurrencySelection } = useSwapActionHandlers()

  const handleAmount = useCallback((value: string) => {
    setAmount(value) // onUserInput(Field.OUTPUT, value)
  }, [])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(requiredAmount, tokens.ethsnacks.address)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const { ethsnacksBuy } = useEthSnacksMint()
  const handleSwap = async () => {
    try {
      await ethsnacksBuy(parsedTokenAmount?.toExact())
    } catch (e) {
      console.log(e)
    }
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    approval === ApprovalState.NOT_APPROVED ||
    approval === ApprovalState.PENDING ||
    (approvalSubmitted && approval === ApprovalState.APPROVED)

  useEffect(() => {
    onCurrencySelection(Field.INPUT, tokens.weth)
    onCurrencySelection(Field.OUTPUT, tokens.ethsnacks)
  }, [onCurrencySelection])

  return (
    <StyledSwapContainer $isChartExpanded={false}>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <CurrencyInputHeader title={t('EthSnacks Buy')} subtitle={t('Buy EthSnacks in an instant')} />
          <Wrapper id="swap-page">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={t('From (estimated)')}
                value={requiredAmount?.toExact()}
                showMaxButton={false}
                currency={tokens.weth}
                onUserInput={() => console.log('required amount')}
                onCurrencySelect={() => console.log('input currency select')}
                otherCurrency={tokens.ethsnacks}
                disableCurrencySelect={!false}
                id="swap-currency-input"
              />

              <CurrencyInputPanel
                value={amount}
                onUserInput={handleAmount}
                label={t('To')}
                showMaxButton={false}
                currency={tokens.ethsnacks}
                onCurrencySelect={() => console.log('output currency select')}
                otherCurrency={tokens.weth}
                disableCurrencySelect={!false}
                onlyInteger={!false}
                id="swap-currency-output"
              />
            </AutoColumn>
            <Box mt="1rem">
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    width="48%"
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        {t('Enabling')} <CircleLoader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      t('Enabled')
                    ) : (
                      t('Enable %asset%', { asset: tokens.cake.symbol ?? '' })
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleSwap()
                    }}
                    width="48%"
                    id="swap-button"
                    disabled={!isValid || approval !== ApprovalState.APPROVED}
                  >
                    {t('Mint')}
                  </Button>
                </RowBetween>
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
                  {t('Mint')}
                </Button>
              )}
              {showApproveFlow && (
                <Column style={{ marginTop: '1rem' }}>
                  <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                </Column>
              )}
            </Box>
          </Wrapper>
          <LightCard>
            <Text fontSize="14px" style={{ textAlign: 'center' }}>
              <span role="img" aria-label="pancake-icon">
                🥞
              </span>{' '}
              {t('You can only mint WHOLE ethsnacks not partial. There are 5% mint fees')}
            </Text>
          </LightCard>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
