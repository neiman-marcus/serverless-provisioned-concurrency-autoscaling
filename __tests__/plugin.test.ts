/* eslint-disable @typescript-eslint/no-explicit-any */
import Plugin from '../src/plugin'
import {
  configDefault,
  configMin,
  configPartial,
  configCustomMetricDefault,
  configCustomMetricMin,
  configScheduledActions,
  configZero,
} from './helpers/config'
import { serverless } from './helpers/serverless'
import { options } from './helpers/options'
import { mockLogging } from './helpers/logging'
import { expectedPolicy } from './helpers/policy'
import {
  expectedTarget,
  expectedTargetWithSingleScheduledAction,
} from './helpers/target'
import { ConcurrencyFunction } from 'src/@types'

const plugin = new Plugin(serverless, {}, mockLogging)

describe('Validate', () => {
  it('should validate true', () => {
    expect(plugin.validate([configMin])).toBeUndefined()
  })
})

describe('Defaults', () => {
  it('should set defaults', () => {
    expect(plugin.defaults(configMin)).toEqual(configDefault)
  })

  it('should have partial defaults', () => {
    expect(plugin.defaults(configPartial)).toEqual({
      ...configDefault,
      ...configPartial,
    })
  })

  it('should allow zero', () => {
    expect(plugin.defaults(configZero).scaleInCooldown).toEqual(0)
  })

  it('should set custom metric config defaults', () => {
    expect(plugin.defaults(configCustomMetricMin)).toEqual(
      configCustomMetricDefault,
    )
  })

  it('should set custom provisioned alias', () => {
    const alias = 'my-custom-alias'
    const configMetric = {
      ...configCustomMetricDefault,
      alias,
    }
    const resource = configMetric.customMetric?.dimensions?.find(
      (el) => el.name === 'Resource',
    ) ?? { value: undefined }

    resource.value = `${configMin.name}:${alias}`

    expect(
      plugin.defaults({
        ...configCustomMetricMin,
        alias,
      }),
    ).toEqual(configMetric)
  })
})

describe('Resources', () => {
  it('should return policy class and match the name', () => {
    const resources: any[] = plugin.resources(configMin)
    expect(resources[0].data.name).toBe('foo-svc-dev-foo')
  })

  it('should return target class and match the name', () => {
    const resources: any[] = plugin.getPolicyAndTarget(options, configDefault)
    expect(resources[1].data.name).toBe('foo-svc-dev-foo')
  })
})

describe('Policy and Target', () => {
  it('should return policy class and match the name', () => {
    const resources: any[] = plugin.getPolicyAndTarget(options, configDefault)
    expect(resources[0].data.name).toBe('foo-svc-dev-foo')
  })

  it('should return target class and match the name', () => {
    const resources: any[] = plugin.getPolicyAndTarget(options, configDefault)
    expect(resources[1].data.name).toBe('foo-svc-dev-foo')
  })
})

describe('Generate', () => {
  it('Should generate resources', () => {
    const resources: any[] = plugin.generate(configDefault)
    expect(resources).toEqual([expectedPolicy, expectedTarget])
  })
})

describe('Validate functions', () => {
  it('Should return true', () => {
    const func = {
      handler: 'handler.foo',
      concurrencyAutoscaling: true,
      provisionedConcurrency: 1,
    } as ConcurrencyFunction
    expect(plugin.validateFunctions(func)).toBeTruthy()
  })

  it.each([true, { enabled: true }])(
    'Function with object configuration should return true',
    (concurrencyAutoscaling: boolean | { enabled: boolean }) => {
      const func = {
        handler: 'handler.foo',
        concurrencyAutoscaling,
        provisionedConcurrency: 1,
      } as ConcurrencyFunction
      expect(plugin.validateFunctions(func)).toBeTruthy()
    },
  )

  it.each([undefined, null, false, {}, { enabled: null }, { enabled: false }])(
    'Function with object configuration should return true',
    (concurrencyAutoscaling: any) => {
      const func = {
        handler: 'handler.foo',
        concurrencyAutoscaling,
        provisionedConcurrency: 1,
      } as ConcurrencyFunction
      expect(plugin.validateFunctions(func)).toBeFalsy()
    },
  )

  it('Should return false', () => {
    const func = {
      handler: 'handler.foo',
      concurrencyAutoscaling: false,
    } as ConcurrencyFunction
    expect(plugin.validateFunctions(func)).toBeFalsy()
  })

  it.each([undefined, null, 0])(
    'Function with Not Set Provisioned Concurrency Should Return False',
    (provisionedConcurrency: number) => {
      const func = {
        handler: 'handler.foo',
        concurrencyAutoscaling: false,
        provisionedConcurrency,
      } as ConcurrencyFunction
      expect(plugin.validateFunctions(func)).toBeFalsy()
    },
  )
})

describe('Process', () => {
  it('Process for cloudformation object', () => {
    plugin.process([configDefault])
    expect(
      plugin.serverless.service.provider.compiledCloudFormationTemplate
        .Resources,
    ).toEqual({
      ...expectedPolicy,
      ...expectedTarget,
    })
  })

  it('Process for CloudFormation with Scheduled Actions', (): void => {
    plugin.process([configScheduledActions])
    expect(
      plugin.serverless.service.provider.compiledCloudFormationTemplate
        .Resources,
    ).toEqual({
      ...expectedPolicy,
      ...expectedTargetWithSingleScheduledAction,
    })
  })
})

describe('BeforeDeployResources', () => {
  it('Run the gambit', () => {
    plugin.process([configDefault])

    plugin.beforeDeployResources()
    expect(
      plugin.serverless.service.provider.compiledCloudFormationTemplate
        .Resources,
    ).toEqual({
      ...expectedPolicy,
      ...expectedTarget,
    })
  })
})
