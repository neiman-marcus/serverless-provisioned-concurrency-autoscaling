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
    expect(name.target('foo')).toEqual('FoosvcFooAutoScalingTargetDevUsfoo2')
  })

  it('Should construct policy resource id', () => {
    expect(name.policy('foo')).toEqual('FoosvcFooAutoScalingPolicyDevUsfoo2')
  })

  it('Should construct alias name', () => {
    expect(name.PCAliasLogicalId('foo')).toEqual('FooProvConcLambdaAlias')
  })

  it('Should build string, without cleaning it', () => {
    expect(name.build('%s-AutoScalingPolicy', 'foo')).toEqual(
      'Foo-svcFoo-AutoScalingPolicyDevUs-foo-2',
    )
  })

  it('Should ucfirst service', () => {
    expect(name.prefix()).toEqual('Foo-svc')
  })

  it('Should return suffix with stage and region', () => {
    expect(name.suffix()).toEqual('DevUs-foo-2')
  })
})
