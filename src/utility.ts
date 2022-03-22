import { createHash } from 'crypto'

export const clean = (input: string): string => {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''))
}

const md5 = (input: string): string => {
  return createHash('md5').update(input).digest('hex')
}

export const truncate = (input: string): string => {
  return input.length <= 64 ? input : input.substr(0, 32) + md5(input)
}

export const ucfirst = (data: string): string => {
  return `${data.charAt(0).toUpperCase()}${data.slice(1)}`
}

export const normalize = (functionName: string): string => {
  return ucfirst(functionName.replace(/-/g, 'Dash').replace(/_/g, 'Underscore'))
}
