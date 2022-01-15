import { CardHeader, Flex, Heading, Text } from '@zoinks-swap/uikit'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean }>`
  background: ${({ isFinished, theme }) =>
    isFinished ? theme.colors.backgroundAlt : theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const PoolCardHeader: React.FC<{
  isFinished?: boolean
  isStaking?: boolean
}> = ({ isFinished = false, isStaking = false, children }) => {

  return (
    <Wrapper isFinished={isFinished}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  )
}

export const PoolCardHeaderTitle: React.FC<{ isFinished?: boolean; title: string; subTitle: string }> = ({
  isFinished,
  title,
  subTitle,
}) => {
  return (
    <Flex flexDirection="column">
      <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
        {title}
      </Heading>
      <Text fontSize="14px" color={isFinished ? 'textDisabled' : 'textSubtle'}>
        {subTitle}
      </Text>
    </Flex>
  )
}

export default PoolCardHeader
