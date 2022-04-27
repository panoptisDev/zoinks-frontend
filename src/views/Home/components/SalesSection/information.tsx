import { useSnacksPrice } from 'hooks/useBUSDPrice'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { usePulseInfo } from './hooks/usePulseInfo'

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

const Informations = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 10000)
  })

  function calculateTimeLeft() {
    const nextPulseTime = new Date()
    nextPulseTime.setUTCHours(1, 0, 0)
    let difference = nextPulseTime.getTime() - new Date().getTime()

    if (difference < 0) difference += 12 * 60 * 60 * 1000
    if (difference < 0) difference += 12 * 60 * 60 * 1000

    const remainTime = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }

    return remainTime
  }

  const { nextPulsePartAmount, nextPulseTotalAmount, totalStakedUSD } = usePulseInfo()

  const { snacksPrice, ethsnacksPrice, btcsnacksPrice } = useSnacksPrice()

  return (
    <>
      <TimerLabelWrapper>
        <LabelValue>
          <LabelDiv>Next Pulse:&nbsp;</LabelDiv>
          <ValueDiv>
            {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
          </ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>Next Pulse Amount:&nbsp;</LabelDiv>
          <ValueDiv>$ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>TOTAL LOCKED:&nbsp;</LabelDiv>
          <ValueDiv>$ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>TVL:&nbsp;</LabelDiv>
          <ValueDiv>$ {totalStakedUSD.toFixed(6)}</ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>Snacks Price:&nbsp;</LabelDiv>
          <ValueDiv>$ {snacksPrice.toFixed(6)}</ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>EthSnacks Price:&nbsp;</LabelDiv>
          <ValueDiv>$ {ethsnacksPrice.toFixed(6)}</ValueDiv>
        </LabelValue>
        <LabelValue>
          <LabelDiv>BtcSnacks Price:&nbsp;</LabelDiv>
          <ValueDiv>$ {btcsnacksPrice.toFixed(6)}</ValueDiv>
        </LabelValue>
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
