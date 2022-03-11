![logo](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/raw/master/images/logo-small.png 'Neiman Marcus')

# ⚡️ serverless-provisioned-concurrency-autoscaling

[![npm](https://img.shields.io/npm/v/serverless-provisioned-concurrency-autoscaling)](https://www.npmjs.com/package/serverless-provisioned-concurrency-autoscaling)
[![build](https://img.shields.io/github/workflow/status/neiman-marcus/serverless-provisioned-concurrency-autoscaling/build%20ci)](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/actions?query=workflow%3A%22build%20ci%22)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/blob/master/LICENSE)
[![pr](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/blob/master/CONTRIBUTING.md)
[![Known Vulnerabilities](https://snyk.io/test/npm/serverless-provisioned-concurrency-autoscaling/badge.svg)](https://snyk.io/test/npm/serverless-provisioned-concurrency-autoscaling)

Serverless Plugin for AWS Lambda Provisioned Concurrency Auto Scaling configuration.

Related blog post can be found on the [Neiman Marcus Medium page](https://medium.com/neiman-marcus-tech/serverless-provisioned-concurrency-autoscaling-3d8ec23d10c).

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

Add `customMetric: true` if you want to use `Maximum` instead of `Average` statistic.

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
      alias: provisioned
      maximum: 10
      minimum: 1
      usage: 0.75
      scaleInCooldown: 0
      scaleOutCooldown: 0
      customMetric:
        statistic: maximum
      scheduledActions:
        - name: OpenOfficeTime
          startTime: "2025-01-01T00:00:00.000Z"
          endTime: "2025-01-01T23:59:59.999Z"
          timezone: "America/Chicago"
          schedule: "cron(30 8 ? * 1-6 *)"
          action:
            maximum: 100
            minimum: 10
        - name: CloseOfficeTime
          startTime: "2025-01-01T00:00:00.000Z"
          endTime: "2025-01-01T23:59:59.999Z"
          timezone: "America/Chicago"
          schedule: "cron(30 17 ? * 1-6 *)"
          action:
            maximum: 10
            minimum: 1
        - name: BlackFridayPeak1
          startTime: "2025-01-02T00:00:00.000Z"
          endTime: "2025-01-02T23:59:59.999Z"
          timezone: "America/New_York"
          schedule: "at(2025-01-02T12:34:56)"
          action:
            maximum: 50
            minimum: 5
        - name: BlackFridayPeak2
          startTime: "2025-01-03T00:00:00.000Z"
          endTime: "2025-01-03T23:59:59.999Z"
          timezone: "Europe/Warsaw"
          schedule: "rate(1 hour)"
          action:
            maximum: 50
            minimum: 5
```

That's it! With the next deployment, [serverless](https://serverless.com) will add Cloudformation resources to scale provisioned concurrency!

You must provide at least `provisionedConcurrency` and `concurrencyAutoscaling` to enable autoscaling. Set `concurrencyAutoscaling` to a boolean, or object with configuration. Any omitted configuration will use module defaults.

### Defaults

```yaml
alias: provisioned
maximum: 10
minimum: 1
usage: 0.75
scaleInCooldown: 0
scaleOutCooldown: 0
```

### Scheduled Actions

For more details on Scheduled Actions formats see
[the AWS CloudFormation ScheduledAction description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html). 

#### Description of `scheduledActions`'s properties:

| Attribute | Description                                                                                                   | Required | Example                          |
|-----------|---------------------------------------------------------------------------------------------------------------|----------|----------------------------------|
| endTime   | The date and time that the action is scheduled to end, in UTC.                                                | no       | `2025-12-31T23:59:59.999Z`       |
| startTime | The date and time that the action is scheduled to begin, in UTC.                                              | no       | `2025-01-01T00:00:00.000Z`       |
| timezone  | Timezone for `startTime` and `endTime`. Needs to be the canonical names of the IANA (supported by Yoda-Time). | no       | `America/Chicago`                |
| name      | The name of the scheduled action unique among all other scheduled actions on the specified scalable target.   | yes      | `OpenOfficeHourScheduleStart`    |
| schedule  | One of three string formats: `at`, `cron` or `rate` (see next table).                                         | yes      | `cron(* 30 8 * 1-6 *)`           |
| action    | Object of `minimum` and `maximum` properties. At least one is required.                                       | yes      | `minimum: 100`<br>`maximum: 105` |

#### Description of `schedule`'s properties:

For more details on schedule syntax see:
 * [AWS CloudFormation ScheduledAction description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scheduledaction.html)
 * [AWS Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) (cron)
 * [AWS Put Scheduled Action - Timezone](https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PutScheduledAction.html#API_PutScheduledAction_RequestSyntax)

| Attribute | Description                          | Format                    | Example                   |
|-----------|--------------------------------------|---------------------------|---------------------------|
| at        | A start (a point in time)            | `at(yyyy-mm-ddThh:mm:ss)` | `at(2025-01-02T00:00:00)` |
| cron      | A cron syntax for recurring schedule | `cron(fields)`            | `cron(30 17 ? * 1-6 *)`   |
| rate      | A rate                               | `rate(value unit)`        | `rate(16 minuets)`        |

## Known Issues/Limitations

N/A

## Authors

- [Clay Danford](mailto:crd013@gmail.com)
- [Dawid Boissé](mailto:dawid.boisse@gmail.com)

## Conduct / Contributing / License

- Refer to our contribution guidelines to contribute to this project. See [CONTRIBUTING.md](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/CONTRIBUTING.md).
- All contributions must follow our code of conduct. See [CONDUCT.md](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/CONDUCT.md).
- This project is licensed under the Apache 2.0 license. See [LICENSE](https://github.com/neiman-marcus/serverless-provisioned-concurrency-autoscaling/tree/master/LICENSE).

## Acknowledgments

- [serverless-dynamodb-autoscaling](https://github.com/sbstjn/serverless-dynamodb-autoscaling) - Original plugin this module is based on.
