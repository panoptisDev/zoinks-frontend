import React from 'react'
import { Flex } from '@zoinks-swap/uikit'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import { earnSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import FarmAuctionsBanner from './components/Banners/FarmAuctionsBanner'
import { useFetchPublicPoolsData } from '../../state/pools/hooks'
import { usePollFarmsPublicData } from '../../state/farms/hooks'

const Home: React.FC = () => {
  usePollFarmsPublicData()
  useFetchPublicPoolsData()

  const HomeSectionContainerStyles = { margin: '0', padding: '100px', width: '100%', maxWidth: '100%' }

  return (
    <>
      <PageMeta />
      <PageSection innerProps={{ style: HomeSectionContainerStyles }} index={2} hasCurvedDivider={false}>
        <SalesSection {...earnSectionData} />
        {/* <FarmsPoolsRow /> */}
      </PageSection>
    </>
  )
}

export default Home
