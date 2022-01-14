import { CardProps } from '@zoinks-swap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'

export interface CollectibleCardProps extends CardProps {
  nft: NftToken
  nftLocation?: NftLocation
  currentAskPrice?: number
  isUserNft?: boolean
}
