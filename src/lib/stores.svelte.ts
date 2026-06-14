import { getContext, setContext } from 'svelte'

class UIState {
}

const UI_KEY = Symbol('ui')

export function setUIState() {
  const state = new UIState()
  setContext(UI_KEY, state)
  return state
}

export function getUIState(): UIState {
  return getContext(UI_KEY)
}
