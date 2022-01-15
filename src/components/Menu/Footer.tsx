import React from 'react'
import styled from 'styled-components'
import { LinkExternal, Flex } from '@zoinks-swap/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: row;
  }
`

const Footer = () => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal id="ercBridge" href="https://docs.binance.org/smart-chain/guides/cross-chain.html">{t('Convert ERC-20 to BEP-20')}</LinkExternal>
      </Flex>
    </Wrapper>
  )
}

export default Footer
