import { clipboard } from 'electron'

export const copy = (str: string) => {
  if (!str) return

  clipboard.writeText(str)
}
