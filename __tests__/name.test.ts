import Name from '../src/name'
import { Options } from 'src/@types'

const NameConstructor = () => {
  const options: Options = {
    region: 'us-foo-2',
    service: 'foo-svc',
    stage: 'dev',
  }

  return new Name(options)
}

const name = NameConstructor()

describe('Name', () => {
  it('Should construct target resource id', () => {
    expect(name.target('foo')).toEqual('FooAutoScalingTarget')
  })

  it('Should construct policy resource id', () => {
    expect(name.policy('foo')).toEqual('FooAutoScalingPolicy')
  })

  it('Should construct alias name', () => {
    expect(name.PCAliasLogicalId('foo')).toEqual('FooProvConcLambdaAlias')
  })
})
