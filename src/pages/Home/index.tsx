import { Play, HandPalm } from 'phosphor-react'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'

import { createContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Countdown } from './components/CountDown'
import { NewCycleForm } from './components/NewCycleForm'

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startedDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface ICyclesContext {
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as ICyclesContext)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informa a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no minimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleForm = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((oldstate) =>
      oldstate.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function handleCreateNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startedDate: new Date(),
    }

    setCycles((oldstate) => [...oldstate, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((oldstate) =>
      oldstate.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisabled = !task
  return (
    <HomeContainer>
      <CyclesContext.Provider
        value={{
          activeCycle,
          activeCycleId,
          markCurrentCycleAsFinished,
          amountSecondsPassed,
          setSecondsPassed,
        }}
      >
        <form onSubmit={handleSubmit(handleCreateNewCycle)} id="countdown">
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
        </form>
        <Countdown />
      </CyclesContext.Provider>
      {activeCycle ? (
        <StopCountDownButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountDownButton>
      ) : (
        <StartCountDownButton
          disabled={isSubmitDisabled}
          type="submit"
          form="countdown"
        >
          <Play size={24} />
          Começar
        </StartCountDownButton>
      )}
    </HomeContainer>
  )
}
