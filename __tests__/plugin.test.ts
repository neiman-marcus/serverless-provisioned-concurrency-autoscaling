/* eslint-disable @typescript-eslint/no-explicit-any */
import Plugin from '../src/plugin'
import {
  configDefault,
  configMin,
  configPartial,
  configCustomMetricDefault,
  configCustomMetricMin,
} from './helpers/config'
import { serverless } from './helpers/serverless'
import { options } from './helpers/options'
import { expectedPolicy } from './helpers/policy'
import { expectedTarget } from './helpers/target'
import { ConcurrencyFunction } from 'src/@types/types'

const plugin = new Plugin(serverless)

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

  it('should set custom metric config defaults', () => {
    expect(plugin.defaults(configCustomMetricMin)).toEqual(
      configCustomMetricDefault,
    )
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
    expect(resources).toStrictEqual([expectedPolicy, expectedTarget])
  })
})

describe('Validate functions', () => {
  it('Should return true', () => {
    const func: ConcurrencyFunction = {
      handler: 'handler.foo',
      concurrencyAutoscaling: true,
      provisionedConcurrency: 1,
    }
    expect(plugin.validateFunctions(func)).toBeTruthy()
  })

  it('Function with object configuration should return true', () => {
    const func: ConcurrencyFunction = {
      handler: 'handler.foo',
      concurrencyAutoscaling: {
        enabled: true,
      },
      provisionedConcurrency: 1,
    }
    expect(plugin.validateFunctions(func)).toBeTruthy()
  })

  it('Should return false', () => {
    const func: ConcurrencyFunction = {
      handler: 'handler.foo',
      concurrencyAutoscaling: false,
    }
    expect(plugin.validateFunctions(func)).toBeFalsy()
  })
})

describe('Process', () => {
  it('Process for cloudformation object', () => {
    plugin.process([configDefault])
    expect(
      plugin.serverless.service.provider.compiledCloudFormationTemplate
        .Resources,
    ).toStrictEqual({
      ...expectedPolicy,
      ...expectedTarget,
    })
  })
})

describe('BeforeDeployResources', () => {
  it('Run the gambit', () => {
    plugin.beforeDeployResources()
    expect(
      plugin.serverless.service.provider.compiledCloudFormationTemplate
        .Resources,
    ).toStrictEqual({
      ...expectedPolicy,
      ...expectedTarget,
    })
  })
})
