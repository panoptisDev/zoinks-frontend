import BigNumber from 'bignumber.js'
import { SerializedFarm, DeserializedPool, SerializedPool } from 'state/types'
import { deserializeToken } from 'state/user/hooks/helpers'
import { BIG_ZERO } from 'utils/bigNumber'

type UserData =
  | DeserializedPool['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
      userInfo?: {
        amount: number | string
        rewardDebt: number | string
        rewardDebtSnacks?: number | string
        rewardDebtEthSnacks?: number | string
        rewardDebtBtcSnacks?: number | string
        lastWithdrawDate: number | string
      }
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
    userInfo: userData
      ? {
          amount: userData.userInfo?.amount ? new BigNumber(userData.userInfo.amount) : BIG_ZERO,
          rewardDebt: userData.userInfo?.rewardDebt ? new BigNumber(userData.userInfo.rewardDebt) : BIG_ZERO,
          rewardDebtSnacks: userData.userInfo?.rewardDebtSnacks
            ? new BigNumber(userData.userInfo.rewardDebtSnacks)
            : BIG_ZERO,
          rewardDebtEthSnacks: userData.userInfo?.rewardDebtEthSnacks
            ? new BigNumber(userData.userInfo.rewardDebtEthSnacks)
            : BIG_ZERO,
          rewardDebtBtcSnacks: userData.userInfo?.rewardDebtBtcSnacks
            ? new BigNumber(userData.userInfo.rewardDebtBtcSnacks)
            : BIG_ZERO,
          lastWithdrawDate: userData.userInfo?.lastWithdrawDate
            ? new BigNumber(userData.userInfo.lastWithdrawDate)
            : BIG_ZERO,
        }
      : {
          amount: BIG_ZERO,
          rewardDebt: BIG_ZERO,
          lastWithdrawDate: BIG_ZERO,
        },
  }
}

export const transformPool = (pool: SerializedPool): DeserializedPool => {
  const { totalStaked, stakingLimit, userData, stakingToken, earningToken, ...rest } = pool

  return {
    ...rest,
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
  }
}

export const getTokenPricesFromFarm = (farms: SerializedFarm[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = farm.quoteToken.address.toLocaleLowerCase()
    const tokenAddress = farm.token.address.toLocaleLowerCase()
    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
