import Name from '../name'

export default class Target {
  data: AutoscalingConfig
  options: Options
  dependencies: any[]
  name: any

  constructor(options: Options, data: AutoscalingConfig) {
    this.options = options
    this.data = data
    this.dependencies = []
    this.name = new Name(options)
  }

  toJSON(): any {
    const nameTarget = this.name.target(this.data.function)

    const DependsOn = [this.name.PCAliasLogicalId(this.data.function)].concat(
      this.dependencies,
    )

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.data.maximum,
          MinCapacity: this.data.minimum,
          ResourceId: `function:${this.data.name}:provisioned`,
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
  }
}
