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
} from './@types'
import { schema } from './schema/schema';
import { log } from '@serverless/utils/log';

const text = {
  CLI_DONE: 'Added Provisioned Concurrency Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building Configuration for resource "lambda/%s"',
  CLI_SKIP: 'Skipping Provisioned Concurrency Auto Scaling: %s!',
  CLI_START: 'Configuring Provisioned Concurrency Auto Scaling...',
  INVALID_CONFIG: 'Invalid serverless Config',
  NO_AUTOSCALING_CONFIG: 'Concurrency configuration is missing',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provider',
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
    const alias = config.alias || 'provisioned'

    const customMetricConfig: CustomMetricConfig = {
      metricName: config.customMetric?.metricName || 'ProvisionedConcurrencyUtilization',
      namespace: config.customMetric?.namespace || 'AWS/Lambda',
      statistic: config.customMetric?.statistic || 'Maximum',
      unit: 'Count',
      dimensions: [
        { name: 'FunctionName', value: config.name },
        { name: 'Resource', value: `${config.name}:${alias}` },
      ],
    }

    return {
      alias,
      name: config.name,
      function: config.function,
      usage: typeof config.usage !== 'undefined' ? config.usage : 0.75,
      minimum: typeof config.minimum !== 'undefined' ? config.minimum : 1,
      maximum: typeof config.maximum !== 'undefined' ? config.maximum : 10,
      scaleInCooldown:
        typeof config.scaleInCooldown !== 'undefined'
          ? config.scaleInCooldown
          : 0,
      scaleOutCooldown:
        typeof config.scaleOutCooldown !== 'undefined'
          ? config.scaleOutCooldown
          : 0,
      customMetric: config.customMetric ? customMetricConfig : undefined,
      scheduledActions: config.scheduledActions,
    }
  }

  resources(config: AutoscalingConfig): CloudFormationResources[] {
    const data = this.defaults(config)

    const options: Options = {
      region: this.serverless.getProvider('aws').getRegion(),
      service: this.serverless.service.getServiceName(),
      stage: this.serverless.getProvider('aws').getStage(),
    }

    log.info(util.format(text.CLI_RESOURCE, config.function))

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
      (typeof instance.provisionedConcurrency ==='number' && instance.provisionedConcurrency > 0 ) &&
      instance.concurrencyAutoscaling &&
      ((typeof instance.concurrencyAutoscaling === 'boolean' &&
        instance.concurrencyAutoscaling) ||
        (typeof instance.concurrencyAutoscaling === 'object' &&
          instance.concurrencyAutoscaling.enabled === true))
    )
  }

  getFunctions(): AutoscalingConfig[] {
    const pcFunctions: AutoscalingConfig[] = []

    const allFunctions = this.serverless.service.getAllFunctions()

    allFunctions.forEach((functionName: string) => {
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

  async beforeDeployResources(): Promise<void> {
    try {
      const pcFunctions = this.getFunctions()
      this.validate(pcFunctions)
      log.info(util.format(text.CLI_START))
      this.process(pcFunctions)
      log.info(util.format(text.CLI_DONE))
    } catch (err) {
      log.info(util.format(text.CLI_SKIP, err.message))
    }
  }
}
