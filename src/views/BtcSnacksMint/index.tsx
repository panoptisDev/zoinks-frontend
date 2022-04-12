import React from 'react'
import styled from 'styled-components'
import { Text, Flex, IconButton } from '@zoinks-swap/uikit'
import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import BtcSnacksBuyCard from './btcsnacksBuyCard'
import BtcSnacksBuyBackCard from './btcsnacksBuyBackCard'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

export default function SnacksMint({ history }: RouteComponentProps) {
  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="row">
          <BtcSnacksBuyCard />
          <BtcSnacksBuyBackCard />
        </Flex>
      </Flex>
    </Page>
  )
}
