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
