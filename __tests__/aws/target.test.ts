import Target from '../../src/aws/target'
import { Options, AutoscalingConfig } from 'src/@types/types'
import { expectedTarget, expectedTargetWithScheduledActions, scheduledActions } from '../helpers/target'

describe('Target', (): void => {
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

  it('construct target object', (): void => {
    const target = new Target(options, data)
    expect(target.toJSON()).toEqual(expectedTarget)
  })

  it('construct target object with scheduled actions', (): void => {
    const dataWithScheduledAction: AutoscalingConfig = {
      ...data,
      scheduledActions
    }
    const target = new Target(options, dataWithScheduledAction)
    expect(target.toJSON()).toEqual(expectedTargetWithScheduledActions)
  })
})
