import { useSnacksPrice } from 'hooks/useBUSDPrice'
import React from 'react'
import { Flex } from '@zoinks-swap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from '../StatCardContent'

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100%;
  color: white;
  font-size: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 1;
    width: 100%;
  }
`

const LabelValue = styled.div`
  display: flex;
  margin-bottom: 5px;
`

const LabelDiv = styled.div`
  width: 50%;
  text-align: right;
`

const ValueDiv = styled.div`
  width: 50%;
  align-self: end;
`

const PriceInfos = () => {
  const { theme } = useTheme()

  const { t } = useTranslation()

  const { snacksPrice, ethsnacksPrice, btcsnacksPrice } = useSnacksPrice()

  return (
    <>
      <Flex flexDirection={['column', null, null, 'row']} justifyContent="center" marginTop="20px">
        <IconCard icon={<div />} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText="Snacks Price"
            bodyText={t('$%snacks%', { snacks: snacksPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard icon={<div />} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText="EthSnacks Price"
            bodyText={t('$%snacks%', { snacks: ethsnacksPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard icon={<div />} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText="BtcSnacks Price"
            bodyText={t('$%snacks%', { snacks: btcsnacksPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
      </Flex>
    </>
  )
}

export default PriceInfos
