import assert from 'assert'
import * as util from 'util'
import * as Serverless from 'serverless'

import Policy from './aws/policy'
import Target from './aws/target'
import { CloudFormationResources } from 'serverless/plugins/aws/provider/awsProvider'
import {
  AutoscalingConfig,
  ConcurrencyFunction,
  Options,
  CustomMetricConfig,
  Dimension,
} from './@types'

const text = {
  CLI_DONE: 'Added Provisioned Concurrency Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building Configuration for resource "lambda/%s"',
  CLI_SKIP: 'Skipping Provisioned Concurrency Auto Scaling: %s!',
  CLI_START: 'Configuring Provisioned Concurrency Auto Scaling...',
  INVALID_CONFIG: 'Invalid serverless Config',
  NO_AUTOSCALING_CONFIG: 'Concurrency configuration is missing',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provider',
}

const schema = {
  properties: {
    concurrencyAutoscaling: {
      anyOf: [{ type: 'boolean' }, { type: 'object' }],
    },
  },
}

export default class Plugin {
  serverless: Serverless
  hooks: Record<string, unknown> = {}

  constructor(serverless: Serverless) {
    this.serverless = serverless

    if (
      this.serverless.configSchemaHandler &&
      this.serverless.configSchemaHandler.defineFunctionProperties
    ) {
      this.serverless.configSchemaHandler.defineFunctionProperties(
        'aws',
        schema,
      )
    }

    this.hooks = {
      'package:compileEvents': this.beforeDeployResources.bind(this),
    }
  }

  validate(pcFunctions: AutoscalingConfig[]): void {
    assert(this.serverless, text.INVALID_CONFIG)
    assert(this.serverless.service, text.INVALID_CONFIG)
    assert(this.serverless.service.provider, text.INVALID_CONFIG)
    assert(this.serverless.service.provider.name, text.INVALID_CONFIG)
    assert(
      this.serverless.service.provider.name === 'aws',
      text.ONLY_AWS_SUPPORT,
    )
    assert(pcFunctions[0] !== undefined, text.NO_AUTOSCALING_CONFIG)
  }

  defaults(config: AutoscalingConfig): AutoscalingConfig {
    const customMetricConfig = config.customMetric
      ? {
          customMetric: this.customMetricDefaults(
            config.customMetric,
            config.name,
            config.alias,
          ),
        }
      : {}

    return {
      maximum: config.maximum || 10,
      minimum: config.minimum || 1,
      scaleInCooldown: config.scaleInCooldown || 120,
      scaleOutCooldown: config.scaleOutCooldown || 0,
      usage: config.usage || 0.75,
      function: config.function,
      name: config.name,
      alias: config.alias || 'provisioned',
      ...customMetricConfig,
    }
  }

  customMetricDefaults(
    customMetric: CustomMetricConfig,
    functionName: string,
    alias: AutoscalingConfig['alias'],
  ): CustomMetricConfig {
    const defaultDimensions: Dimension[] = [
      {
        name: 'FunctionName',
        value: functionName,
      },
      {
        name: 'Resource',
        value: `${functionName}:${alias}`,
      },
    ]

    return {
      dimensions: defaultDimensions,
      metricName: 'ProvisionedConcurrencyUtilization',
      namespace: 'AWS/Lambda',
      statistic: customMetric.statistic || 'Maximum',
      unit: 'Count',
    }
  }

  resources(config: AutoscalingConfig): CloudFormationResources[] {
    const data = this.defaults(config)

    const options: Options = {
      region: this.serverless.getProvider('aws').getRegion(),
      service: this.serverless.service.getServiceName(),
      stage: this.serverless.getProvider('aws').getStage(),
    }

    this.serverless.cli.log(util.format(text.CLI_RESOURCE, config.function))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resources: any[] = []

    resources.push(...this.getPolicyAndTarget(options, data))

    return resources
  }

  getPolicyAndTarget(
    options: Options,
    data: AutoscalingConfig,
  ): [Policy, Target] {
    return [new Policy(options, data), new Target(options, data)]
  }

  generate(config: AutoscalingConfig): CloudFormationResources[] {
    let resources: CloudFormationResources[] = []
    let lastResources: unknown[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = this.resources(config).map((resource: any) => {
      resource.dependencies = lastResources

      return resource.toJSON()
    })

    resources = resources.concat(current)
    lastResources = current.map((item: CloudFormationResources) =>
      Object.keys(item).pop(),
    )

    return resources
  }

  validateFunctions(instance: ConcurrencyFunction): boolean {
    return !!(
      instance.provisionedConcurrency &&
      instance.provisionedConcurrency > 0 &&
      instance.concurrencyAutoscaling &&
      ((typeof instance.concurrencyAutoscaling === 'boolean' &&
        instance.concurrencyAutoscaling) ||
        (typeof instance.concurrencyAutoscaling === 'object' &&
          instance.concurrencyAutoscaling.enabled === true))
    )
  }

  getFunctions(): AutoscalingConfig[] {
    const pcFunctions: AutoscalingConfig[] = []

    this.serverless.service.getAllFunctions().forEach((functionName) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance: any = this.serverless.service.getFunction(functionName)

      if (this.validateFunctions(instance)) {
        pcFunctions.push({
          function: functionName,
          name: instance.name,
          ...instance.concurrencyAutoscaling,
        })
      }
    })
    return pcFunctions
  }

  process(pcFunctions: AutoscalingConfig[]): boolean {
    pcFunctions.forEach((config: AutoscalingConfig) => {
      const functionConfig = this.generate(config)

      functionConfig.forEach((resource) => {
        this.serverless.service.provider.compiledCloudFormationTemplate.Resources =
          {
            ...this.serverless.service.provider.compiledCloudFormationTemplate
              .Resources,
            ...resource,
          }
      })
    })
    return true
  }

  async beforeDeployResources(): Promise<unknown> {
    try {
      await Promise.resolve()
      const pcFunctions = this.getFunctions()
      this.validate(pcFunctions)
      this.serverless.cli.log(util.format(text.CLI_START))
      this.process(pcFunctions)
      return this.serverless.cli.log(util.format(text.CLI_DONE))
    } catch (err) {
      return this.serverless.cli.log(util.format(text.CLI_SKIP, err.message))
    }
  }
}
