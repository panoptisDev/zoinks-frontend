import React from 'react'
import styled from 'styled-components'
import { Text, Flex, IconButton } from '@zoinks-swap/uikit'
import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import SnacksBuyCard from './snacksBuyCard'
import SnacksBuyBackCard from './snacksBuyBackCard'

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
          <SnacksBuyCard />
          <SnacksBuyBackCard />
        </StyledFlex>
      </Flex>
    </Page>
  )
}
