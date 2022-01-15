import React from 'react'
import styled from 'styled-components'
import { Box } from '@zoinks-swap/uikit'
import Container from '../Layout/Container'
import { PageHeaderProps } from './types'

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<PageHeaderProps> = ({ children, ...props }) => (
  <Box {...props}>
    <Inner>{children}</Inner>
  </Box>
)

export default PageHeader
