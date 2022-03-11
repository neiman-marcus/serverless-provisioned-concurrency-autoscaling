import * as util from 'util'
import { clean, ucfirst, normalize } from './utility'
import { Options } from './@types'

const TEXT = {
  POLICYSCALE: '%s-AutoScalingPolicy',
  TARGET: '%s-AutoScalingTarget',
}

export default class Name {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  target(func: string): string {
    return clean(ucfirst(util.format(TEXT.TARGET, func)))
  }

  policy(func: string): string {
    return clean(ucfirst(util.format(TEXT.POLICYSCALE, func)))
  }

  PCAliasLogicalId(functionName: string): string {
    return `${normalize(functionName)}ProvConcLambdaAlias`
  }
}
