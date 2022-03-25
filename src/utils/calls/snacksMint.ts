import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const snacksBuy = async (snacksContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).toString()

  const tx = await snacksContract.buy(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const snacksRedeem = async (snacksContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).toString()

  const tx = await snacksContract.redeem(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}
