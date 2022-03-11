export const expectedPolicy = {
  FooAutoScalingPolicy: {
    DependsOn: [
      'FooAutoScalingTarget',
      'FooProvConcLambdaAlias',
    ],
    Properties: {
      PolicyName: 'FooAutoScalingPolicy',
      PolicyType: 'TargetTrackingScaling',
      ScalingTargetId: { Ref: 'FooAutoScalingTarget' },
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
        },
        ScaleInCooldown: 0,
        ScaleOutCooldown: 0,
        TargetValue: 0.75,
      },
    },
    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
  },
}
