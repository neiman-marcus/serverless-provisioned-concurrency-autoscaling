import Name from '../name'
import { Options, AutoscalingConfig } from 'src/@types/types'

export default class Target {
  data: AutoscalingConfig
  options: Options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[]
  name: Name

  constructor(options: Options, data: AutoscalingConfig) {
    this.options = options
    this.data = data
    this.dependencies = []
    this.name = new Name(options)
  }

  getSchedulesActions(): unknown[] {
    console.log('--- scheduledActions generation ---')
    console.log(JSON.stringify(this.data))
    return this.data.scheduledActions?.map(scheduledAction => { return {
        EndTime: scheduledAction.endTime,
        StartTime: scheduledAction.startTime,
        Timezone: scheduledAction.timezone,
        ScalableTargetAction: {
          MaxCapacity: scheduledAction.action.maximum,
          MinCapacity: scheduledAction.action.minimum
        },
        ScheduledActionName: scheduledAction.name,
        Schedule: scheduledAction.schedule
    }}) as unknown[]
  }

  toJSON(): Record<string, unknown> {
    const nameTarget = this.name.target(this.data.function)

    const DependsOn = [this.name.PCAliasLogicalId(this.data.function)].concat(
      this.dependencies,
    )

    const ScheduledActions = this.getSchedulesActions()

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.data.maximum,
          MinCapacity: this.data.minimum,
          ResourceId: `function:${this.data.name}:${this.data.alias}`,
          ScalableDimension: 'lambda:function:ProvisionedConcurrency',
          ServiceNamespace: 'lambda',
          RoleARN: {
            'Fn::Sub': 'arn:aws:iam::${AWS::AccountId}:role/aws-service-role/lambda.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_LambdaConcurrency',
          },
          ScheduledActions
        },
        Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
      },
    }
  }
}
