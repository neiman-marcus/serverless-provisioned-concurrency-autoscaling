"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const name_1 = __importDefault(require("../name"));
const utility_1 = require("../utility");
class Policy {
    constructor(options, data) {
        this.options = options;
        this.data = data;
        this.dependencies = [];
        this.name = new name_1.default(options);
    }
    toJSON() {
        const PolicyName = this.name.policy(this.data.function);
        const Target = this.name.target(this.data.function);
        const DependsOn = [
            Target,
            this.name.PCAliasLogicalId(this.data.function),
        ].concat(this.dependencies);
        const metricSpecificationJson = this.data.customMetric
            ? this.customMetricJson(this.data.customMetric)
            : this.predefinedMetricJson();
        return {
            [PolicyName]: {
                DependsOn,
                Properties: {
                    PolicyName: this.name.policy(this.data.function),
                    PolicyType: 'TargetTrackingScaling',
                    ScalingTargetId: { Ref: Target },
                    TargetTrackingScalingPolicyConfiguration: Object.assign({ ScaleInCooldown: this.data.scaleInCooldown, ScaleOutCooldown: this.data.scaleOutCooldown, TargetValue: this.data.usage }, metricSpecificationJson),
                },
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            },
        };
    }
    predefinedMetricJson() {
        return {
            PredefinedMetricSpecification: {
                PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
            },
        };
    }
    customMetricJson(customMetric) {
        return {
            CustomizedMetricSpecification: {
                Dimensions: (customMetric.dimensions || []).map((d) => ({
                    Name: d.name,
                    Value: d.value,
                })),
                MetricName: customMetric.metricName,
                Namespace: customMetric.namespace,
                Statistic: (0, utility_1.ucfirst)(customMetric.statistic || ''),
                Unit: customMetric.unit,
            },
        };
    }
}
exports.default = Policy;
//# sourceMappingURL=policy.js.map