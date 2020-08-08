import * as util from 'util'
import { clean, ucfirst, normalize } from './utility'

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
    return clean(this.build(TEXT.TARGET, func))
  }

  policy(func: string): string {
    return clean(this.build(TEXT.POLICYSCALE, func))
  }

  PCAliasLogicalId(functionName: any) {
    return `${normalize(functionName)}ProvConcLambdaAlias`
  }

  build(data: string, func: string): string {
    return [
      this.prefix(),
      ucfirst(util.format(data, func)),
      this.suffix(),
    ].join('')
  }

  prefix() {
    return ucfirst(this.options.service)
  }

  suffix(): string {
    return [this.options.stage, this.options.region].map(ucfirst).join('')
  }
}
