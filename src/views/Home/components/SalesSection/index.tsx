import React from 'react'
import { Flex, Button, Heading } from '@zoinks-swap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CompositeImage, { CompositeImageProps } from '../CompositeImage'

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  images: CompositeImageProps
}

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { headingText, bodyText, reverse, images } = props

  const headingTranslatedText = t(headingText)
  const bodyTranslatedText = t(bodyText)

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center">
        <Flex
          flexDirection="column"
          flex="1"
          ml={[null, null, null, reverse && '64px']}
          mr={[null, null, null, !reverse && '64px']}
          alignSelf={['flex-start', null, null, 'center']}>
          <Heading as="h1" scale="xxl" color="overlay" mb="24px">
              {headingTranslatedText}
            </Heading>
          <Heading scale="md" color="overlay">
            {bodyTranslatedText}
          </Heading>
          <Flex 
            flexDirection="column"
            flex="1"
            alignSelf={['flex-start', null, null, null]}
            mt="8px">
            {!account && <ConnectWalletButton/>}
            <Flex mt="8px">
              <RouterLink to="/swap">
                <Button mr="8px" color="primary">{t('Trade Now')}</Button>
              </RouterLink>
              <RouterLink to="/farms">
                <Button color="primary">{t('Earn')}</Button>
              </RouterLink>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}>
          <CompositeImage {...images} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
