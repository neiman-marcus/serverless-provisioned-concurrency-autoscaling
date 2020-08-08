import Resource from './resource'

export default class Policy extends Resource {
  data: AutoscalingConfig

  readonly type: string = 'AWS::ApplicationAutoScaling::ScalingPolicy'

  constructor(options: Options, data: AutoscalingConfig) {
    super(options)
    this.data = data
  }

  toJSON(): any {
    const PolicyName = this.name.policy(this.data.function)
    const Target = this.name.target(this.data.function)
    const DependsOn = [Target].concat(this.dependencies)

    return {
      [PolicyName]: {
        DependsOn,
        Properties: {
          PolicyName,
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
        Type: this.type,
      },
    }
  }
}
