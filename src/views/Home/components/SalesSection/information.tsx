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
    width: auto;
  }
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

  const { nextPulsePartAmount, nextPulseTotalAmount, snacksPrice, ethsnacksPrice, btcsnacksPrice, totalStakedUSD } =
    usePulseInfo()

  return (
    <>
      <TimerLabelWrapper>
        <div>
          Next Pulse: {timeLeft.hours} hrs {timeLeft.minutes} mins {timeLeft.seconds} secs
        </div>
        <div>Next Pulse Amount : $ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</div>
        <div>TOTAL LOCKED: $ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</div>
        <div>TVL: $ {totalStakedUSD.toFixed(6)}</div>
        <div>Snacks Price: $ {snacksPrice.toFixed(6)}</div>
        <div>EthSnacks Price: $ {ethsnacksPrice.toFixed(6)}</div>
        <div>BtcSnacks Price: $ {btcsnacksPrice.toFixed(6)}</div>
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
