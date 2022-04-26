import { useSnacksPrice } from 'hooks/useBUSDPrice'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { usePulseInfo } from './hooks/usePulseInfo'

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100%;
  color: white;
  font-size: 30px;
  display: flex;

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

  const { nextPulsePartAmount, nextPulseTotalAmount, totalStakedUSD } = usePulseInfo()

  const { snacksPrice, ethsnacksPrice, btcsnacksPrice } = useSnacksPrice()

  return (
    <>
      <TimerLabelWrapper>
        <div style={{ textAlign: 'right' }}>
          <div>Next Pulse:&nbsp;</div>
          <div>Next Pulse Amount:&nbsp;</div>
          <div>TOTAL LOCKED:&nbsp;</div>
          <div>TVL:&nbsp;</div>
          <div>Snacks Price:&nbsp;</div>
          <div>EthSnacks Price:&nbsp;</div>
          <div>BtcSnacks Price:&nbsp;</div>
        </div>
        <div>
          <div>
            {timeLeft.hours} hrs {timeLeft.minutes} mins {timeLeft.seconds} secs
          </div>
          <div>$ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</div>
          <div>$ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</div>
          <div>$ {totalStakedUSD.toFixed(6)}</div>
          <div>$ {snacksPrice.toFixed(6)}</div>
          <div>$ {ethsnacksPrice.toFixed(6)}</div>
          <div>$ {btcsnacksPrice.toFixed(6)}</div>
        </div>
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
