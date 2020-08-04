declare interface autoscalingConfig extends Config {
  function: string
}

declare interface Config {
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
