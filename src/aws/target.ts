import Resource from './resource'

export default class Target extends Resource {
  private readonly type = 'AWS::ApplicationAutoScaling::ScalableTarget'

  private readonly roleArn =
    'arn:aws:iam::${AWS::AccountId}:role/aws-service-role/lambda.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_LambdaConcurrency'

  constructor(options: Options, private data: AutoscalingConfig) {
    super(options)
  }

  public toJSON(): any {
    let resource = `function:${this.data.name}:provisioned`

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
          ResourceId: resource,
          RoleARN: { 'Fn::Sub': this.roleArn },
          ScalableDimension: 'lambda:function:ProvisionedConcurrency',
          ServiceNamespace: 'lambda',
        },
        Type: this.type,
      },
    }
  }
}
