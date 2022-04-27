import { useSnacksPrice } from 'hooks/useBUSDPrice'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Timer from '../Timer'
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
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: end;
`
const TimerWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 16px;
  }
  margin-bottom: 8px;
  .custom-timer {
    background: url('/images/decorations/countdownBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 0px 10px 7px;
    display: inline-flex;
  }
`

const InfoDiv = styled.div`
  padding: 30px;
  border: 1px white solid;
  border-radius: 20px;
  margin-bottom: 20px;
`

const SplitDiv = styled.div`
  padding: 20px;
  text-align: center;
  width: 50%;
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

  return (
    <>
      <TimerLabelWrapper>
        <InfoDiv>
          <LabelValue
            style={{
              fontSize: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'end',
              marginBottom: '30px',
            }}
          >
            Next Pulse in &nbsp;
            <Timer
              wrapperClassName="custom-timer"
              seconds={timeLeft.seconds}
              minutes={timeLeft.minutes}
              hours={timeLeft.hours}
            />
          </LabelValue>
          <LabelValue>Next Pulse Amount is $ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</LabelValue>
        </InfoDiv>
        <InfoDiv style={{ display: 'flex', justifyContent: 'center' }}>
          <SplitDiv>
            <div>TOTAL LOCKED</div>
            <div>$ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</div>
          </SplitDiv>
          <SplitDiv style={{ borderLeft: '1px white solid' }}>
            <div>TVL</div>
            <div>$ {totalStakedUSD.toFixed(6)}</div>
          </SplitDiv>
        </InfoDiv>
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
