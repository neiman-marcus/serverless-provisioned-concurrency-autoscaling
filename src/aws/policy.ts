import Name from '../name'
import {
  Options,
  AutoscalingConfig,
  CustomMetricConfig,
} from 'src/@types'
import { ucfirst } from '../utility'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): Record<string, any> {
    const PolicyName = this.name.policy(this.data.function)
    const Target = this.name.target(this.data.function)
    const DependsOn = [
      Target,
      this.name.PCAliasLogicalId(this.data.function),
    ].concat(this.dependencies)

    const metricSpecificationJson = this.data.customMetric
      ? this.customMetricJson(this.data.customMetric)
      : this.predefinedMetricJson()

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
            ...metricSpecificationJson,
          },
        },
        Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
      },
    }
  }

  private predefinedMetricJson(): Record<string, unknown> {
    return {
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
      },
    }
  }

  private customMetricJson(
    customMetric: CustomMetricConfig,
  ): Record<string, unknown> {
    return {
      CustomizedMetricSpecification: {
        Dimensions: (customMetric.dimensions || []).map((d) => ({
          Name: d.name,
          Value: d.value,
        })),
        MetricName: customMetric.metricName,
        Namespace: customMetric.namespace,
        Statistic: ucfirst(customMetric.statistic || ''),
        Unit: customMetric.unit,
      },
    }
  }
}
