export const expectedTarget = {
  FoosvcFooAutoScalingTargetDevUsfoo2: {
    DependsOn: ['FooProvConcLambdaAlias'],
    Properties: {
      MaxCapacity: 10,
      MinCapacity: 1,
      ResourceId: 'function:foo-svc-dev-foo:provisioned',
      ScalableDimension: 'lambda:function:ProvisionedConcurrency',
      ServiceNamespace: 'lambda',
      RoleARN: {
        'Fn::Sub':
          'arn:aws:iam::${AWS::AccountId}:role/aws-service-role/lambda.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_LambdaConcurrency',
      },
    },
    Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
  },
}
