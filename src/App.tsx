import { ThemeProvider } from 'styled-components'
import { Router } from './Router'
import { GlobalStyle } from './style/global'
import { defaultTheme } from './style/themes/default'
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />

        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
