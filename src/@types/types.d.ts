declare interface AutoscalingConfig {
  function: string
  name: string
  maximum?: number
  minimum?: number
  usage?: number
  scaleInCooldown?: number
  scaleOutCooldown?: number
}

declare interface Options {
  region: string
  service: string
  stage: string
}
