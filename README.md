![logo](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/raw/master/images/logo-small.png 'Neiman Marcus')

# ⚡️ serverless-provisioned-concurrency-autoscaling

[![npm](https://img.shields.io/npm/v/serverless-provisioned-concurrency-autoscaling)](https://www.npmjs.com/package/serverless-provisioned-concurrency-autoscaling) [![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/blob/master/LICENSE) [![pr](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/blob/master/CONTRIBUTING.md)

Serverless Plugin for AWS Lambda Provisioned Concurrency Auto Scaling configuration.

## Usage

Add the [NPM package](https://www.npmjs.com/package/serverless-provisioned-concurrency-autoscaling) to your project:

```bash
$ npm install serverless-provisioned-concurrency-autoscaling
```

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-provisioned-concurrency-autoscaling
```

## Configuration

Add `concurrencyAutoscaling` parameters under each function you wish to autoscale in your `serverless.yml`.

```yaml
# minimal configuration

functions:
  hello:
    handler: handler.hello
    provisionedConcurrency: 1
    concurrencyAutoscaling: true

  # full configuration

  world:
    handler: handler.world
    provisionedConcurrency: 1
    concurrencyAutoscaling:
      enabled: true
      maximum: 10
      minimum: 1
      usage: 0.75
      scaleInCooldown: 120
      scaleOutCooldown: 0
```

That's it! With the next deployment, [serverless](https://serverless.com) will add Cloudformation resources to scale provisioned concurrency!

You must provide atleast `provisionedConcurrency` and `concurrencyAutoscaling` to enable autoscaling. Set `concurrencyAutoscaling` to a boolean, or object with configuration. Any omitted configuration will use module defaults.

### Defaults

```yaml
maximum: 10
minimum: 1
usage: 0.75
scaleInCooldown: 120
scaleOutCooldown: 0
```

## Known Issues/Limitations

N/A

## Authors

- [Clay Danford](mailto:crd013@gmail.com)

## Conduct / Contributing / License

- Refer to our contribution guidelines to contribute to this project. See [CONTRIBUTING.md](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/CONTRIBUTING.md).
- All contributions must follow our code of conduct. See [CONDUCT.md](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/CONDUCT.md).
- This project is licensed under the Apache 2.0 license. See [LICENSE](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/LICENSE).

## Acknowledgments

- [serverless-dynamodb-autoscaling](https://github.com/sbstjn/serverless-dynamodb-autoscaling) - Original plugin this module is based on.
