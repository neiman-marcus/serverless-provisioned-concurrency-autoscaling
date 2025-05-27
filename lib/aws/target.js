"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const name_1 = __importDefault(require("../name"));
class Target {
    constructor(options, data) {
        this.options = options;
        this.data = data;
        this.dependencies = [];
        this.name = new name_1.default(options);
    }
    getSchedulesActions() {
        var _a;
        return (_a = this.data.scheduledActions) === null || _a === void 0 ? void 0 : _a.map((scheduledAction) => {
            return {
                EndTime: scheduledAction.endTime,
                StartTime: scheduledAction.startTime,
                Timezone: scheduledAction.timezone,
                ScalableTargetAction: {
                    MaxCapacity: scheduledAction.action.maximum,
                    MinCapacity: scheduledAction.action.minimum,
                },
                ScheduledActionName: scheduledAction.name,
                Schedule: scheduledAction.schedule,
            };
        });
    }
    toJSON() {
        const nameTarget = this.name.target(this.data.function);
        const DependsOn = [this.name.PCAliasLogicalId(this.data.function)].concat(this.dependencies);
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
                    ScheduledActions: this.data.scheduledActions
                        ? this.getSchedulesActions()
                        : undefined,
                },
                Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            },
        };
    }
}
exports.default = Target;
//# sourceMappingURL=target.js.map