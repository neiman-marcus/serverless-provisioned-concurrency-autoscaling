import md5 from 'md5'
import _ from 'lodash'
import * as util from 'util'

const TEXT = {
  POLICYSCALE: 'AutoScalingPolicy-%s',
  TARGET: 'AutoScalingTarget-%s',
}

const clean = (input: string): string =>
  truncate(input.replace(/[^a-z0-9+]+/gi, ''))

const truncate = (input: string): string =>
  input.length <= 64 ? input : input.substr(0, 32) + md5(input)

const ucfirst = (data: string): string => `${_.upperFirst(data)}`

export default class Name {
  constructor(private options: Options) {}

  public target(func: string): string {
    return clean(this.build(TEXT.TARGET, func))
  }

  public policy(func: string): string {
    return clean(this.build(TEXT.POLICYSCALE, func))
  }

  public PCAliasLogicalId(functionName: any) {
    return `${this.normalizedFunctionName(functionName)}ProvConcLambdaAlias`
  }

  private normalizedFunctionName(functionName: string) {
    return ucfirst(
      functionName.replace(/-/g, 'Dash').replace(/_/g, 'Underscore'),
    )
  }

  private build(data: string, ...args: string[]): string {
    return [args ? util.format(data, ...args) : data, this.suffix()].join('')
  }

  private suffix(): string {
    return [this.options.stage, this.options.region].map(ucfirst).join('')
  }
}
