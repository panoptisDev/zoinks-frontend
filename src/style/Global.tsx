import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@zoinks-swap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }
  body {
    background: ${({ theme }) => theme.colors.backgroundAlt};

    img { 
      height: auto;
      max-width: 100%;
    }

    .bg {
      background: url(/images/background.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: fixed;
      height: 100vh;
      width: 100vw;  
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
`

export default GlobalStyle
