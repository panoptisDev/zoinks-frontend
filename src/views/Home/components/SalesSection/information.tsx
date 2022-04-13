import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { usePulseInfo } from './hooks/usePulseInfo'

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100px;
  color: white;
  font-size: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 1;
    width: auto;
  }
`

const Informations = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  function calculateTimeLeft() {
    const utcTime = new Date()
    const nextPulseTime = utcTime.setHours(1, 0, 0)

    let difference = nextPulseTime - new Date().getTime()

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

  const { nextPulsePartAmount, nextPulseTotalAmount, snacksPrice, ethsnacksPrice, btcsnacksPrice } = usePulseInfo()

  return (
    <>
      <TimerLabelWrapper>
        <div>
          Next Pulse: {timeLeft.hours.toString()} hours: {timeLeft.minutes} minutes: {timeLeft.seconds} seconds
        </div>
        <div>Next Pulse Amount : $ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</div>
        <div>TVL : $ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</div>
        <div>Snacks Price: {snacksPrice?.toExact()}</div>
        <div>EthSnacks Price: {ethsnacksPrice?.toExact()}</div>
        <div>BtcSnacks Price: {btcsnacksPrice?.toExact()}</div>
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
