declare interface Configuration {
  function: string
  maximum: number
  minimum: number
  usage: number
  scaleInCooldown: number
  scaleOutCooldown: number
}

declare interface Options {
  region: string
  service: string
  stage: string
}

declare namespace Serverless {
  namespace Service {
    interface Custom {
      concurrency: Configuration[]
    }
  }
}
