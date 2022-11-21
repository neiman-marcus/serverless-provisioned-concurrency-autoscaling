import { configMin } from './config';
import { AutoscalingConfig, CustomMetricConfig, ScheduledAction } from '../../src/@types';

export const userDefinedConfig = (
  enabled: unknown = true,
  alias: unknown = 'provisioned',
  maximum?: unknown,
  minimum?: unknown,
  usage?: unknown,
  scaleInCooldown?: unknown,
  scaleOutCooldown?: unknown
): AutoscalingConfig => ({
  ...configMin,
  enabled,
  alias,
  maximum,
  minimum,
  usage,
  scaleInCooldown,
  scaleOutCooldown
} as unknown as AutoscalingConfig);

export const customMetricConfig = (
  statistic?: unknown
): AutoscalingConfig => ({
  ...userDefinedConfig(),
  customMetric: {
    statistic
  } as CustomMetricConfig
} as unknown as AutoscalingConfig);

export const customScheduledActionsConfig = (
  scheduledActions: unknown
): AutoscalingConfig => ({
  ...configMin,
  scheduledActions
} as unknown as AutoscalingConfig);

export const customScheduledAction = (
  name: unknown = 'scheduledActionRequiredName',
  schedule: unknown = 'cron(30 8 ? * 1-6 *)',
  action: unknown = { minimum: 1 }
): ScheduledAction => ({
  name,
  schedule,
  action
} as unknown as ScheduledAction);
