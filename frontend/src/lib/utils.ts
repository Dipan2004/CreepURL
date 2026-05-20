import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    const success = document.execCommand('copy')
    document.body.removeChild(el)
    return success
  }
}

export function isValidURL(str: string): boolean {
  try {
    const s = str.startsWith('http') ? str : `https://${str}`
    new URL(s)
    return true
  } catch {
    return false
  }
}

export function normalizeURL(str: string): string {
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    return `https://${str}`
  }
  return str
}
