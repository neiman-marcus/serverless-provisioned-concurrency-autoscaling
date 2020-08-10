import Name from '../name'
import { Options, AutoscalingConfig } from 'src/@types/types'

export default class Policy {
  data: AutoscalingConfig
  options: Options
  name: Name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[]

  constructor(options: Options, data: AutoscalingConfig) {
    this.options = options
    this.data = data
    this.dependencies = []
    this.name = new Name(options)
  }

  toJSON(): Record<string, unknown> {
    const PolicyName = this.name.policy(this.data.function)
    const Target = this.name.target(this.data.function)
    const DependsOn = [Target].concat(this.dependencies)

    return {
      [PolicyName]: {
        DependsOn,
        Properties: {
          PolicyName: this.name.policy(this.data.function),
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: Target },
          TargetTrackingScalingPolicyConfiguration: {
            PredefinedMetricSpecification: {
              PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
            },
            ScaleInCooldown: this.data.scaleInCooldown,
            ScaleOutCooldown: this.data.scaleOutCooldown,
            TargetValue: this.data.usage,
          },
        },
        Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
      },
    }
  }
}
