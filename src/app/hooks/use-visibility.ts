import { useState } from 'react';

export const useVisibility = (
  defaultVisibility = false
): [boolean, () => void, () => void, () => void] => {
  const [visible, setVisibility] = useState(defaultVisibility)

  const hide = () => {
    setVisibility(false)
  }

  const show = () => {
    setVisibility(true)
  }

  const toggle = () => {
    setVisibility(!visible)
  }

  return [visible, toggle, show, hide]
}
