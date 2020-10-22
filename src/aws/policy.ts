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

  toJSON(): Record<string, any> {
    const PolicyName = this.name.policy(this.data.function)
    const Target = this.name.target(this.data.function)
    const DependsOn = [Target, this.name.PCAliasLogicalId(this.data.function)].concat(this.dependencies)

    const metricSpecification =
      this.data.customMetric ?
        this.customMetricSpec() : this.predfinedMetricSpec()

    return {
      [PolicyName]: {
        DependsOn,
        Properties: {
          PolicyName: this.name.policy(this.data.function),
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: Target },
          TargetTrackingScalingPolicyConfiguration: {
            ScaleInCooldown: this.data.scaleInCooldown,
            ScaleOutCooldown: this.data.scaleOutCooldown,
            TargetValue: this.data.usage,
            ...metricSpecification
          },
        },
        Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
      },
    }
  }

  private predfinedMetricSpec(): Record<string, unknown> {
    return {
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
      }
    }
  }

  private customMetricSpec(): Record<string, unknown> {
    return {
      CustomizedMetricSpecification: {
        Dimensions: [{
          Name: 'FunctionName',
          Value: `${this.data.name}`
        },
        {
          Name: 'Resource',
          Value: `${this.data.name}:provisioned`
        }],
        MetricName: 'ProvisionedConcurrencyUtilization',
        Namespace: 'AWS/Lambda',
        Statistic: 'Average',
        Unit: 'Count'
      }
    }
  }
}
