export const expectedPolicy = {
  FoosvcFooAutoScalingPolicyDevUsfoo2: {
    DependsOn: [
      'FoosvcFooAutoScalingTargetDevUsfoo2',
      'FooProvConcLambdaAlias',
    ],
    Properties: {
      PolicyName: 'FoosvcFooAutoScalingPolicyDevUsfoo2',
      PolicyType: 'TargetTrackingScaling',
      ScalingTargetId: { Ref: 'FoosvcFooAutoScalingTargetDevUsfoo2' },
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
        },
        ScaleInCooldown: 120,
        ScaleOutCooldown: 0,
        TargetValue: 0.75,
      },
    },
    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
  },
}
