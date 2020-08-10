import { AutoscalingConfig } from '../../src/@types/types'

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
}
