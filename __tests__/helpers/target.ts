import { ScalableTargetAction, ScheduledAction } from '../../src/@types';

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

export const expectedTargetWithSingleScheduledAction = {
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
      ScheduledActions: [
        {
          ScheduledActionName: 'scheduledActionName1st',
          Schedule: 'cron(30 8 ? * 1-6 *)',
          ScalableTargetAction: {
            MinCapacity: 14
          }
        },
      ]
    },
    Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  }
}

export const expectedTargetWithScheduledActions = {
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
      ScheduledActions: [
        {
          ScheduledActionName: 'scheduledActionsName1st',
          EndTime: '2025-12-31T23:59:59.999Z',
          Timezone: 'America/Chicago',
          Schedule: 'cron(30 8 ? * 1-6 *)',
          ScalableTargetAction: {
            MinCapacity: 10
          }
        },
        {
          ScheduledActionName: 'scheduledActionsName2nd',
          StartTime: '2025-01-01T00:00:00.000Z',
          Schedule: 'cron(30 17 ? * 1-6 *)',
          ScalableTargetAction: {
            MinCapacity: 2,
            MaxCapacity: 11
          }
        },
        {
          ScheduledActionName: 'scheduledActionsName3rd',
          Schedule: 'at(2025-12-31T23:59:59)',
          ScalableTargetAction: {
            MaxCapacity: 13
          }
        },
        {
          ScheduledActionName: 'scheduledActionsName4th',
          Schedule: 'rate(24 hours)',
          ScalableTargetAction: {
            MinCapacity: 13,
            MaxCapacity: 26
          }
        }
      ]
    },
    Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  }
}

export const scheduledActions: ScheduledAction[] = [
  {
    name: 'scheduledActionsName1st',
    endTime: '2025-12-31T23:59:59.999Z',
    timezone: 'America/Chicago',
    schedule: 'cron(30 8 ? * 1-6 *)',
    action: {
      minimum: 10
    } as ScalableTargetAction
  } as ScheduledAction,
  {
    name: 'scheduledActionsName2nd',
    startTime: '2025-01-01T00:00:00.000Z',
    schedule: 'cron(30 17 ? * 1-6 *)',
    action: {
      minimum: 2,
      maximum: 11
    } as ScalableTargetAction
  } as ScheduledAction,
  {
    name: 'scheduledActionsName3rd',
    schedule: 'at(2025-12-31T23:59:59)',
    action: {
      maximum: 13
    } as ScalableTargetAction
  } as ScheduledAction,
  {
    name: 'scheduledActionsName4th',
    schedule: 'rate(24 hours)',
    action: {
      minimum: 13,
      maximum: 26
    } as ScalableTargetAction
  } as ScheduledAction
]
