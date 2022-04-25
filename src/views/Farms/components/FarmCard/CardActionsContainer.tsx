import { Button, Flex, Text, Heading } from '@zoinks-swap/uikit'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useSnacksPrice } from 'hooks/useBUSDPrice'
import React, { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { DeserializedFarm } from 'state/types'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { logError } from 'utils/sentry'
import { getBalanceAmount } from 'utils/formatBalance'
import useApproveFarm from '../../hooks/useApproveFarm'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
  lpLabel?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, cakePrice, lpLabel }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const { allowance, tokenBalance, stakedBalance, earnings, snacksEarnings, ethSnacksEarnings, btcSnacksEarnings } =
    farm.userData || {}

  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  const lpContract = useERC20(lpAddress)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setRequestedApproval(false)
    }
  }, [onApprove, dispatch, account, pid, t, toastError])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pid={pid}
        apr={farm.apr}
        lpLabel={lpLabel}
        cakePrice={cakePrice}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  const { snacksPrice, ethsnacksPrice, btcsnacksPrice } = useSnacksPrice()

  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayZoinksBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0

  const rawSnacksEarningsBalance = account ? getBalanceAmount(snacksEarnings) : BIG_ZERO
  const displaySnacksBalance = rawSnacksEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsSnacksBusd = rawSnacksEarningsBalance
    ? rawSnacksEarningsBalance.multipliedBy(snacksPrice).toNumber()
    : 0

  const rawEthSnacksEarningsBalance = account ? getBalanceAmount(ethSnacksEarnings) : BIG_ZERO
  const displayEthSnacksBalance = rawEthSnacksEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsEthSnacksBusd = rawEthSnacksEarningsBalance
    ? rawEthSnacksEarningsBalance.multipliedBy(ethsnacksPrice).toNumber()
    : 0

  const rawBtcSnacksEarningsBalance = account ? getBalanceAmount(btcSnacksEarnings) : BIG_ZERO
  const displayBtcSnacksBalance = rawBtcSnacksEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBtcSnacksBusd = rawBtcSnacksEarningsBalance
    ? rawBtcSnacksEarningsBalance.multipliedBy(btcsnacksPrice).toNumber()
    : 0

  return (
    <Action>
      <Flex justifyContent="space-between">
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            Zoinks
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Earned')}
          </Text>
        </Flex>
        <Flex>
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayZoinksBalance}</Heading>&nbsp;
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between">
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            Snacks
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Earned')}
          </Text>
        </Flex>
        <Flex>
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displaySnacksBalance}</Heading>&nbsp;
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsSnacksBusd} unit=" USD" prefix="~" />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between">
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            EthSnacks
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Earned')}
          </Text>
        </Flex>
        <Flex>
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayEthSnacksBalance}</Heading>&nbsp;
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={earningsEthSnacksBusd}
            unit=" USD"
            prefix="~"
          />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between">
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            BtcSnacks
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Earned')}
          </Text>
        </Flex>
        <Flex>
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBtcSnacksBalance}</Heading>&nbsp;
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={earningsBtcSnacksBusd}
            unit=" USD"
            prefix="~"
          />
        </Flex>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
