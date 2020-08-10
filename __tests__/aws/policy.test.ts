import Policy from '../../src/aws/policy'
import { Options, AutoscalingConfig } from 'src/@types/types'
import { expectedPolicy } from '../helpers/policy'

const PolicyConstructor = () => {
  const options: Options = {
    region: 'us-foo-2',
    service: 'foo-svc',
    stage: 'dev',
  }

  const data: AutoscalingConfig = {
    function: 'foo',
    name: 'foo-svc-dev-foo',
    scaleInCooldown: 120,
    scaleOutCooldown: 0,
    usage: 0.75,
  }

  return new Policy(options, data)
}

describe('Policy', () => {
  it('construct policy object', () => {
    const policy = PolicyConstructor()
    expect(policy.toJSON()).toEqual(expectedPolicy)
  })
})
