/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverless: any = {
  cli: {
    log: console.log,
  },
  service: {
    getAllFunctions(): any[] {
      return ['foo']
    },
    getFunction(functionName: string): any {
      return {
        handler: 'handler.hello',
        provisionedConcurrency: 1,
        concurrencyAutoscaling: true,
        events: [],
        name: `foo-svc-dev-${functionName}`,
        package: {},
        memory: 1024,
        timeout: 6,
        runtime: 'nodejs12.x',
        vpc: {},
        versionLogicalId:
          'HelloLambdaVersion0Otd4P0e98XajR4keLBshIyWK1yyxFOZK9AJZD7Wo',
        targetAlias: {
          name: 'provisioned',
          logicalId: 'HelloProvConcLambdaAlias',
        },
      }
    },
    getServiceName(): string {
      return this.service
    },
    provider: {
      name: 'aws',
      compiledCloudFormationTemplate: {
        Resources: {},
      },
    },
    service: 'foo-svc',
    functions: {
      foo: {
        name: 'foo-svc-dev-foo',
        provisionedConcurrency: 1,
        concurrencyAutoscaling: true,
      },
    },
  },
  getProvider: () => {
    return {
      getRegion: () => 'us-foo-2',
      getStage: () => 'dev',
    }
  },
}
