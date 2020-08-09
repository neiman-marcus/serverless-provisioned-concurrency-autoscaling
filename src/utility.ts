import md5 from 'md5'
import _ from 'lodash'

export const clean = (input: string): string => {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''))
}

const truncate = (input: string): string => {
  return input.length <= 64 ? input : input.substr(0, 32) + md5(input)
}

export const ucfirst = (data: string): string => {
  return `${_.upperFirst(data)}`
}

export const normalize = (functionName: string): string => {
  return ucfirst(functionName.replace(/-/g, 'Dash').replace(/_/g, 'Underscore'))
}
