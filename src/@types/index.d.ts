import { AwsFunction } from 'serverless/plugins/aws/provider/awsProvider'

export interface AutoscalingConfig extends AwsFunctionConfig {
  function: string
  name: string
}

export interface Options {
  region: string
  service: string
  stage: string
}

export interface ConcurrencyFunction extends AwsFunction {
  concurrencyAutoscaling: boolean | AwsFunctionConfig
}

export interface AwsFunctionConfig {
  enabled?: boolean
  maximum?: number
  minimum?: number
  usage?: number
  scaleInCooldown?: number
  scaleOutCooldown?: number
  customMetric?: CustomMetricConfig
  alias?: string
  scheduledActions?: ScheduledAction[]
}

export interface CustomMetricConfig {
  dimensions?: Dimension[]
  metricName?: string
  namespace?: string
  statistic?: string
  unit?: string
}

export interface Dimension {
  name: string
  value: string
}

export interface ScheduledAction {
  name: string
  startTime?: string
  endTime?: string
  timezone?: string
  schedule: string
  action: ScalableTargetAction
}

export interface ScalableTargetAction {
  maximum?: number
  minimum?: number
}

interface PluginLogger {
  info: (message: string) => void
  success: (message: string) => void
  warning: (message: string) => void
  error: (message: string) => void
  debug: (message: string) => void
  notice: (message: string) => void
}
