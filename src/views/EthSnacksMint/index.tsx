import React from 'react'
import styled from 'styled-components'
import { Text, Flex, IconButton } from '@zoinks-swap/uikit'
import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import EthSnacksBuyCard from './ethsnacksBuyCard'
import EthSnacksBuyBackCard from './ethsnacksBuyBackCard'

const StyledFlex = styled(Flex)`
  flex-direction: row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

export default function EthSnacksMint({ history }: RouteComponentProps) {
  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <StyledFlex>
          <EthSnacksBuyCard />
          <EthSnacksBuyBackCard />
        </StyledFlex>
      </Flex>
    </Page>
  )
}
