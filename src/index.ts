import assert from 'assert'
import _ from 'lodash'
import * as util from 'util'
import * as Serverless from 'serverless'

import Policy from './aws/policy'
import Target from './aws/target'

const text = {
  CLI_DONE: 'Added Provisoned Concurrency Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building Config for resource "lambda/%s"',
  CLI_SKIP: 'Skipping Provisioned Concurrency Auto Scaling: %s!',
  CLI_START: 'Configuring Provisioned Concurrency Auto Scaling...',
  INVALID_CONFIG: 'Invalid serverless Config',
  NO_AUTOSCALING_CONFIG:
    'No Provisioned Concurrency and/or Auto Scaling Config found',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provider',
}

class AWSPCAutoScaling {
  public hooks: {}

  constructor(private serverless: Serverless) {
    this.hooks = {
      'package:compileEvents': this.beforeDeployResources.bind(this),
    }
  }

  // Get the current stage name
  private getStage(): string {
    return this.serverless.getProvider('aws').getStage()
  }

  // Get the current service name
  private getServiceName(): string {
    return this.serverless.service.getServiceName()
  }

  // Get the current service region
  private getRegion(): string {
    return this.serverless.getProvider('aws').getRegion()
  }

  // Validate request and check if Config is available
  private validate(pcFunctions: any[]): void {
    assert(this.serverless, text.INVALID_CONFIG)
    assert(this.serverless.service, text.INVALID_CONFIG)
    assert(this.serverless.service.provider, text.INVALID_CONFIG)
    assert(this.serverless.service.provider.name, text.INVALID_CONFIG)
    assert(
      this.serverless.service.provider.name === 'aws',
      text.ONLY_AWS_SUPPORT
    )
    assert(pcFunctions.length >= 1, text.NO_AUTOSCALING_CONFIG)
  }

  // Parse Config and fill up with default values when needed
  private defaults(config: autoscalingConfig): autoscalingConfig {
    return {
      maximum: config.maximum ? config.maximum : 10,
      minimum: config.minimum ? config.minimum : 1,
      scaleInCooldown: config.scaleInCooldown ? config.scaleInCooldown : 120,
      scaleOutCooldown: config.scaleOutCooldown ? config.scaleOutCooldown : 0,
      usage: config.usage ? config.usage : 0.75,
      function: config.function,
    }
  }

  // Create CloudFormation resources for lambda
  private resources(config: autoscalingConfig): any[] {
    const data = this.defaults(config)

    const options: Options = {
      region: this.getRegion(),
      service: this.getServiceName(),
      stage: this.getStage(),
    }

    // Start processing Config
    this.serverless.cli.log(util.format(text.CLI_RESOURCE, config.function))

    const resources: any[] = []

    // Push autoscaling Config
    resources.push(...this.getPolicyAndTarget(options, data))

    return resources
  }

  // Create Policy and Target resource
  private getPolicyAndTarget(options: Options, data: autoscalingConfig): any[] {
    return [new Policy(options, data), new Target(options, data)]
  }

  // Generate CloudFormation resources for lambda provisioned concurrency
  private generate(config: autoscalingConfig) {
    let resources: any[] = []
    let lastRessources: any[] = []

    const current = this.resources(config).map((resource: any) =>
      resource.setDependencies(lastRessources).toJSON()
    )

    resources = resources.concat(current)
    lastRessources = current.map((item: any) => Object.keys(item).pop())

    return resources
  }

  // Check if parameter is defined and return as array if only a string is provided
  private normalize(data: string | string[]): string[] {
    if (data && data.constructor !== Array) {
      return [data as string]
    }

    return ((data as string[]) || []).slice(0)
  }

  private getFunctions() {
    let pcFunctions: any[] = []

    this.serverless.service.getAllFunctions().forEach((functionName) => {
      const instance: any = this.serverless.service.getFunction(functionName)

      if (!instance.provisionedConcurrency) return
      if (!instance.concurrencyAutoscaling) return
      if (
        typeof instance.concurrencyAutoscaling === 'boolean' &&
        instance.concurrencyAutoscaling !== true
      )
        return
      if (typeof instance.concurrencyAutoscaling === 'object') {
        if (!('enabled' in instance.concurrencyAutoscaling)) return
        if (instance.concurrencyAutoscaling.enabled !== true) return
      }

      pcFunctions.push({
        function: functionName,
        ...instance.concurrencyAutoscaling,
      })
    })
    return pcFunctions
  }

  // Process the provided Config
  private process(pcFunctions: autoscalingConfig[]) {
    pcFunctions.forEach((config: autoscalingConfig) =>
      this.normalize(config.function).forEach(() =>
        this.generate(config).forEach((resource: string) =>
          _.merge(
            this.serverless.service.provider.compiledCloudFormationTemplate
              .Resources,
            resource
          )
        )
      )
    )
  }

  private async beforeDeployResources(): Promise<any> {
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

module.exports = AWSPCAutoScaling
