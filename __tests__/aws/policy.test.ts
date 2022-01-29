import Policy from '../../src/aws/policy'
import { Options } from 'src/@types/types'
import { expectedPolicy } from '../helpers/policy'

const options: Options = {
  region: 'us-foo-2',
  service: 'foo-svc',
  stage: 'dev',
}

describe('Policy', () => {
  it('should construct complete policy object', () => {
    const policy = new Policy(options, {
      function: 'foo',
      name: 'foo-svc-dev-foo',
      scaleInCooldown: 120,
      scaleOutCooldown: 0,
      usage: 0.75,
    })
    expect(policy.toJSON()).toEqual(expectedPolicy)
  })

  it('should set configurable scaling policy parameters', () => {
    const policy = new Policy(options, {
      function: 'bar',
      name: 'bar-svc-dev-bar',
      scaleInCooldown: 80,
      scaleOutCooldown: 10,
      usage: 0.5,
      customMetric: {
        dimensions: [
          {
            name: 'FunctionName',
            value: 'bar-svc-dev-bar',
          },
          {
            name: 'Resource',
            value: 'bar-svc-dev-bar:provisioned',
          },
        ],
        metricName: 'ProvisionedConcurrencyUtilization',
        namespace: 'AWS/Lambda',
        statistic: 'average',
        unit: 'Count',
      },
    })

    const policyJson = policy.toJSON()
    expect(policyJson).toHaveProperty('FoosvcBarAutoScalingPolicyDevUsfoo2')

    const policyProperties =
      policyJson.FoosvcBarAutoScalingPolicyDevUsfoo2.Properties
    expect(policyProperties).toHaveProperty(
      'TargetTrackingScalingPolicyConfiguration',
      {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: 'FunctionName',
              Value: 'bar-svc-dev-bar',
            },
            {
              Name: 'Resource',
              Value: 'bar-svc-dev-bar:provisioned',
            },
          ],
          MetricName: 'ProvisionedConcurrencyUtilization',
          Namespace: 'AWS/Lambda',
          Statistic: 'Average',
          Unit: 'Count',
        },
        ScaleInCooldown: 80,
        ScaleOutCooldown: 10,
        TargetValue: 0.5,
      },
    )
  })

  it('should set configurable custom metric parameters', () => {
    const policy = new Policy(options, {
      function: 'foo',
      name: 'foo-svc-dev-foo',
      customMetric: {
        dimensions: [
          {
            name: 'someName',
            value: 'someValue',
          },
        ],
        metricName: 'SomeMetric',
        namespace: 'AWS/ELB',
        statistic: 'maximum',
        unit: 'Sum',
      },
    })

    const policyConfiguration = policy.toJSON()
      .FoosvcFooAutoScalingPolicyDevUsfoo2.Properties
      .TargetTrackingScalingPolicyConfiguration

    expect(policyConfiguration).toHaveProperty(
      'CustomizedMetricSpecification',
      {
        Dimensions: [
          {
            Name: 'someName',
            Value: 'someValue',
          },
        ],
        MetricName: 'SomeMetric',
        Namespace: 'AWS/ELB',
        Statistic: 'Maximum',
        Unit: 'Sum',
      },
    )
  })

  it('should set empty dimensions and statistics', () => {
    const policy = new Policy(options, {
      function: 'foo',
      name: 'foo-svc-dev-foo',
      customMetric: {
        metricName: 'SomeMetric',
        namespace: 'AWS/ELB',
        unit: 'Sum',
      },
    })

    const policyConfiguration = policy.toJSON()
      .FoosvcFooAutoScalingPolicyDevUsfoo2.Properties
      .TargetTrackingScalingPolicyConfiguration

    expect(policyConfiguration).toHaveProperty(
      'CustomizedMetricSpecification',
      {
        Dimensions: [],
        MetricName: 'SomeMetric',
        Namespace: 'AWS/ELB',
        Statistic: '',
        Unit: 'Sum',
      },
    )
  })
})
