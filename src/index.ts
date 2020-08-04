import assert from 'assert'
import _ from 'lodash'
import * as util from 'util'

import Policy from './aws/policy'
import Target from './aws/target'

const text = {
  CLI_DONE: 'Added Provisoned Concurrency Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building configuration for resource "lambda/%s"',
  CLI_SKIP: 'Skipping Provisioned Concurrency Auto Scaling: %s!',
  CLI_START: 'Configuring Provisioned Concurrency Auto Scaling …',
  INVALID_CONFIGURATION: 'Invalid serverless configuration',
  NO_AUTOSCALING_CONFIG: 'No Auto Scaling configuration found',
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

  // Validate request and check if configuration is available
  private validate(): void {
    assert(this.serverless, text.INVALID_CONFIGURATION)
    assert(this.serverless.service, text.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider, text.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider.name, text.INVALID_CONFIGURATION)
    assert(
      this.serverless.service.provider.name === 'aws',
      text.ONLY_AWS_SUPPORT
    )

    assert(this.serverless.service.custom, text.NO_AUTOSCALING_CONFIG)
    assert(
      this.serverless.service.custom.concurrency,
      text.NO_AUTOSCALING_CONFIG
    )
  }

  // Parse configuration and fill up with default values when needed
  private defaults(config: Configuration): Configuration {
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
  private resources(config: Configuration): any[] {
    const data = this.defaults(config)

    const options: Options = {
      region: this.getRegion(),
      service: this.getServiceName(),
      stage: this.getStage(),
    }

    // Start processing configuration
    this.serverless.cli.log(util.format(text.CLI_RESOURCE, config.function))

    const resources: any[] = []

    // Push autoscaling configuration
    resources.push(...this.getPolicyAndTarget(options, data))

    return resources
  }

  // Create Policy and Target resource
  private getPolicyAndTarget(options: Options, data: Configuration): any[] {
    return [new Policy(options, data), new Target(options, data)]
  }

  // Generate CloudFormation resources for lambda provisioned concurrency
  private generate(config: Configuration) {
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

  // Process the provided configuration
  private process() {
    this.serverless.service.custom.concurrency.forEach(
      (config: Configuration) =>
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
      this.validate()
      this.serverless.cli.log(util.format(text.CLI_START))
      this.process()
      return this.serverless.cli.log(util.format(text.CLI_DONE))
    } catch (err) {
      return this.serverless.cli.log(util.format(text.CLI_SKIP, err.message))
    }
  }
}

module.exports = AWSPCAutoScaling
