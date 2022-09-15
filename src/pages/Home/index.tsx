import { Play } from 'phosphor-react'
import {
  HomeContainer,
  FormContainer,
  CountDownContainer,
  Separator,
} from './styles'

export function Home() {
  return (
    <HomeContainer>
      <form id="countdown">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <input type="text" id="task" />

          <label htmlFor="minutesAmount">durante</label>
          <input type="number" id="minutesAmount" />

          <span>minutos.</span>
        </FormContainer>
      </form>

      <CountDownContainer>
        <span>0</span>
        <span>0</span>
        <Separator>:</Separator>
        <span>0</span>
        <span>0</span>
      </CountDownContainer>

      <button type="submit" form="countdown">
        <Play size={24} />
        Começar
      </button>
    </HomeContainer>
  )
}
