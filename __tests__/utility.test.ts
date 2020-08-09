import { clean, ucfirst, normalize, truncate } from '../src/utility'

const truncateSample = 'foo-ab632fb2-99a0-45f9-a479-edcc'

describe('Utility', () => {
  it('should return string without special characters', () => {
    expect(clean('**foo**')).toEqual('foo')
  })

  it('should return string with no changes', () => {
    expect(truncate(truncateSample)).toEqual(truncateSample)
  })

  it('should return string with md5 hash suffix', () => {
    const foo = truncate(`${truncateSample}38a63e9d-ab632fb2-99a0-45f9-a479foo`)
    expect(foo).toContain(truncateSample)
    expect(foo.length).toBe(64)
  })

  it('should return string with uppercase first character', () => {
    expect(ucfirst('foo')).toEqual('Foo')
  })

  it('should return string with dashes and underscores transformed', () => {
    expect(normalize('foo-bar_baz')).toEqual('FooDashbarUnderscorebaz')
  })
})
