import Target from '../../src/aws/target'
import { Options, AutoscalingConfig } from 'src/@types/types'
import { expectedTarget } from '../helpers/target'

const TargetConstructor = () => {
  const options: Options = {
    region: 'us-foo-2',
    service: 'foo-svc',
    stage: 'dev',
  }

  const data: AutoscalingConfig = {
    function: 'foo',
    alias: 'provisioned',
    name: 'foo-svc-dev-foo',
    maximum: 10,
    minimum: 1,
  }

  return new Target(options, data)
}

describe('Target', () => {
  it('construct target object', () => {
    const target = TargetConstructor()
    expect(target.toJSON()).toEqual(expectedTarget)
  })
})
