import Policy from '../../src/aws/policy'
import { Options } from 'src/@types/types'
import { expectedPolicy } from '../helpers/policy'

const options: Options = {
  region: 'us-foo-2',
  service: 'foo-svc',
  stage: 'dev'
}

describe('Policy', () => {
  it('should construct comeplete policy object', () => {
    const policy = new Policy(options,
      {
        function: 'foo',
        name: 'foo-svc-dev-foo',
        scaleInCooldown: 120,
        scaleOutCooldown: 0,
        usage: 0.75,
        customMetric: false,
      })
    expect(policy.toJSON()).toEqual(expectedPolicy)
  })

  it('should set configurable scaling policy parameters', () => {
    const policy = new Policy(options,
      {
        function: 'bar',
        name: 'bar-svc-dev-bar',
        scaleInCooldown: 80,
        scaleOutCooldown: 10,
        usage: 0.5,
        customMetric: true,
      })

    const policyJson = policy.toJSON()
    expect(policyJson).toHaveProperty('FoosvcBarAutoScalingPolicyDevUsfoo2')

    const policyProperties = policyJson.FoosvcBarAutoScalingPolicyDevUsfoo2.Properties
    expect(policyProperties).toHaveProperty('TargetTrackingScalingPolicyConfiguration',
      {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: "FunctionName",
              Value: "bar-svc-dev-bar",
            },
            {
              Name: "Resource",
              Value: "bar-svc-dev-bar:provisioned",
            },
          ],
          MetricName: "ProvisionedConcurrencyUtilization",
          Namespace: "AWS/Lambda",
          Statistic: "Average",
          Unit: "Count",
        },
        ScaleInCooldown: 80,
        ScaleOutCooldown: 10,
        TargetValue: 0.5,
      })
  })
})
