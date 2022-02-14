import { AutoscalingConfig, ScalableTargetAction, ScheduledAction } from '../../src/@types/types'

export const configMin: AutoscalingConfig = {
  function: 'foo',
  name: 'foo-svc-dev-foo',
}

export const configPartial: AutoscalingConfig = {
  ...configMin,
  maximum: 30,
  usage: 0.92,
}

export const configDefault: AutoscalingConfig = {
  ...configMin,
  minimum: 1,
  maximum: 10,
  usage: 0.75,
  scaleInCooldown: 120,
  scaleOutCooldown: 0,
  alias: 'provisioned',
}

export const configCustomMetricMin: AutoscalingConfig = {
  ...configDefault,
  customMetric: {
    statistic: 'maximum',
  },
}

export const configCustomMetricDefault: AutoscalingConfig = {
  ...configDefault,
  customMetric: {
    dimensions: [
      {
        name: 'FunctionName',
        value: 'foo-svc-dev-foo',
      },
      {
        name: 'Resource',
        value: 'foo-svc-dev-foo:provisioned',
      },
    ],
    metricName: 'ProvisionedConcurrencyUtilization',
    namespace: 'AWS/Lambda',
    statistic: 'maximum',
    unit: 'Count',
  },
}

export const configScheduledActions: AutoscalingConfig = {
  ...configMin,
  scheduledActions: [
    {
      name: 'scheduledActionName1st',
      schedule: 'cron(* 30 8 * * *)',
      action: {
        minimum: 14
      } as ScalableTargetAction
    } as ScheduledAction
  ] as ScheduledAction[]
}
