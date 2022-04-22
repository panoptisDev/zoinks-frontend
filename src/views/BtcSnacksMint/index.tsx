import React from 'react'
import styled from 'styled-components'
import { Text, Flex, IconButton } from '@zoinks-swap/uikit'
import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import BtcSnacksBuyCard from './btcsnacksBuyCard'
import BtcSnacksBuyBackCard from './btcsnacksBuyBackCard'

const StyledFlex = styled(Flex)`
  flex-direction: row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

export default function SnacksMint({ history }: RouteComponentProps) {
  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <StyledFlex>
          <BtcSnacksBuyCard />
          <BtcSnacksBuyBackCard />
        </StyledFlex>
      </Flex>
    </Page>
  )
}
