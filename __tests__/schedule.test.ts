import { allConfigs, configMin } from './helpers/config';
import { AutoscalingConfig, ConcurrencyFunction, ScalableTargetAction, ScheduledAction } from '../src/@types';
import Ajv from 'ajv-draft-04';
import { schema } from '../src/schema/schema';
import {
  customMetricConfig,
  customScheduledAction,
  customScheduledActionsConfig,
  userDefinedConfig
} from './helpers/invalidConfigs';

describe('Schema Validation', (): void => {
  const validate = new Ajv().compile(schema);

  describe('Positive Schema Validation', (): void => {
    it.each([true, false])('All Boolean Configs are Valid', (
      config: boolean
    ): void => {
      const result = validate(functionConfig(config));
      expect(result).toEqual(true);
    });

    const generateAllCustomStatisticsTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const statistics: string[] = [
        'Average', 'Maximum', 'Minimum', 'SampleCount', 'Sum',
        'average', 'maximum', 'minimum', 'sampleCount', 'sum'
      ];

      for (const statistic of statistics) {
        testCases.push(customMetricConfig(statistic));
      }

      return testCases;
    };

    it.each([
      ...allConfigs,
      userDefinedConfig(),
      userDefinedConfig(true, 'scaleOutTest', 10, 1, 0.75, 0, 0),
      ...generateAllCustomStatisticsTestCases(),
      customScheduledActionsConfig([customScheduledAction()])
    ])('All Test Configs Should be Valid', (
      config: AutoscalingConfig
    ): void => {
      const result = validate(functionConfig(config));
      expect(result).toEqual(true);
    });

    it.each([
      { minimum: 1 } as ScalableTargetAction,
      { maximum: 1 } as ScalableTargetAction,
      { minimum: 1, maximum: 2 } as ScalableTargetAction,
      { minimum: 2, maximum: 1 } as ScalableTargetAction,
    ])('Positive Schema Validation - Scheduled Actions', (
      action: ScalableTargetAction
    ): void => {
      const result = validate(schedulesActionConfig(action));
      expect(result).toEqual(true);
    });

    const generateValidScheduleTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const schedules = [
        'rate(1 minute)', 'rate(2 minutes)', 'rate(42 minutes)',
        'rate(1 hour)', 'rate(2 hours)', 'rate(42 hours)',
        'rate(1 day)', 'rate(2 days)', 'rate(42 days)',
        'at(2025-01-02T12:12:12)', 'at(2000-02-29T23:59:59)',
        'cron(30 17 ? * 1-6 *)', 'cron(/ / / / # /)', 'cron(/ / L / L /)', 'cron(/ / W / L /)',
        'cron(* * * * * *)', 'cron(* * ? * ? *)', 'cron(1 2 3 4 5 6)', 'cron(- - - - - -)', 'cron(, , , , , ,)',
        'cron(1-2 2-3 3-4 4-5 5-6 6-7)'
      ];

      for (const schedule of schedules) {
        testCases.push(customScheduledActionsConfig([customScheduledAction('name', schedule, { minimum: 1 } as ScalableTargetAction)]));
      }

      return testCases;
    };

    it.each(generateValidScheduleTestCases())('Positive Schedule Validation', (config: AutoscalingConfig): void => {
      const result = validate(functionConfig(config));
      expect(result).toEqual(true);
    });
  });

  describe('Negative Schema Validation', (): void => {
    const generateMinMaxInOutTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const values = [-1, NaN, '42', { isNumber: false }, 0.75];

      for (const value of values) {
        testCases.push(userDefinedConfig(true, 'maxTest', value));
        testCases.push(userDefinedConfig(true, 'minTest', 10, value));
        testCases.push(userDefinedConfig(true, 'scaleInTest', 10, 1, 0.75, value));
        testCases.push(userDefinedConfig(true, 'scaleOutTest', 10, 1, 0.75, 0, value));
      }

      return testCases;
    };

    const generateUsageTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const values = [-1, NaN, '42', { isObject: true }, 'random', '', null];

      for (const value of values) {
        testCases.push(userDefinedConfig(true, 'minTest', 10, 1, value));
        testCases.push(customMetricConfig(value));
        testCases.push(customScheduledActionsConfig(value));
        testCases.push(customScheduledActionsConfig([value]));
      }

      return testCases;
    };

    const generateScheduledActionTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const values = [-1, NaN, { isObject: true }, '', null];

      testCases.push(customScheduledActionsConfig([]));
      for (const value of values) {
        testCases.push(customScheduledActionsConfig([customScheduledAction(value)]));
        testCases.push(customScheduledActionsConfig([customScheduledAction('name', value)]));
        testCases.push(customScheduledActionsConfig([customScheduledAction('name', 'cron(30 8 ? * 1-6 *)', value)]));
      }

      return testCases;
    };

    it.each([
      userDefinedConfig('abc'),
      userDefinedConfig(true, ''),
      userDefinedConfig(true, 1),
      userDefinedConfig(true, { some: 'object' }),
      ...generateMinMaxInOutTestCases(),
      ...generateUsageTestCases(),
      customMetricConfig(),
      customScheduledActionsConfig([]),
      ...generateScheduledActionTestCases()
    ])('Invalid Configs Fails Schema Validation', (
      config: AutoscalingConfig
    ): void => {
      const result = validate(functionConfig(config));
      expect(result).toEqual(false);
    });

    it.each([
      { minimum: 1, avg: 1 } as ScalableTargetAction,
      { maximum: 1, avg: 1 } as ScalableTargetAction,
      { minimum: 1, maximum: 1, avg: 1 } as ScalableTargetAction,
    ])('Negative Schema Validation - Scheduled Actions', (
      action: ScalableTargetAction
    ): void => {
      const result = validate(schedulesActionConfig(action));
      expect(result).toEqual(false);
    });

    type StartEndTimeType = { startTime: string, endTime: string };
    const generateInvalidStartAndEndTimes = (): StartEndTimeType[] => {
      const testCases: StartEndTimeType[] = [];
      const values: string[] = ['', '1', 'random'];

      for (const value in values) {
        testCases.push({ startTime: value } as StartEndTimeType);
        testCases.push({ endTime: value } as StartEndTimeType);
        testCases.push({ startTime: value, endTime: value } as StartEndTimeType);
      }

      return testCases;
    };

    it.each(generateInvalidStartAndEndTimes())('123', ({ startTime, endTime }): void => {
      const result = validate(schedulesActionConfigWithStartAndEndTime(startTime, endTime));
      expect(result).toEqual(false);
    });

    const generateInvalidScheduleTestCases = (): AutoscalingConfig[] => {
      const testCases: AutoscalingConfig[] = [];
      const schedules = [
        'rate(0 minute)', 'rate(0 hour)', 'rate(0 day)',
        'rate(a minute)', 'rate(b hour)', 'rate(c day)',
        'rate(11 asd)',
        'at(205-01-02T12:12:12)', 'at(2000-022-29T23:59:59)', 'at(2000-02-298T23:59:59)', 'at(2000-02-29T232:59:59)', 'at(2000-02-29T23:591:59)', 'at(2000-02-29T23:59:591)',
        'at(20225-01-02T12:12:12)', 'at(2000-2-29T23:59:59)', 'at(2000-02-2T23:59:59)', 'at(2000-02-29T3:59:59)', 'at(2000-02-29T23:9:59)', 'at(2000-02-29T23:59:5)',
        'at(2000:02-29T23:59:59)', 'at(2000-02:29T23:59:59)', 'at(2000-02-29T23-59:59)', 'at(2000-02-29T23:59-59)', 'at(2000-02-29Z23:59-59)',
        'cron(/ / / # / /)', 'cron(/ / 1 L 2 /)', 'cron(/ / L / W /)',
        'cron(* * ? ? ? *)', 'cron(a 2 3 4 5 6)'
      ];

      for (const schedule of schedules) {
        testCases.push(customScheduledActionsConfig([customScheduledAction('name', schedule, { minimum: 1 } as ScalableTargetAction)]));
      }

      return testCases;
    };

    it.each(generateInvalidScheduleTestCases())('Negative Schedule Validation', (config: AutoscalingConfig): void => {
      const result = validate(functionConfig(config));
      expect(result).toEqual(false);
    });
  });

  const functionConfig = (concurrencyAutoscaling: AutoscalingConfig | boolean): ConcurrencyFunction => ({
    concurrencyAutoscaling,
    provisionedConcurrency: 1,
  } as ConcurrencyFunction);

  const schedulesActionConfig = (action: ScalableTargetAction) => ({
    concurrencyAutoscaling: {
      ...configMin,
      scheduledActions: [
        customScheduledAction('name', 'cron(30 8 ? * 1-6 *)', action)
      ] as ScheduledAction[]
    },
    provisionedConcurrency: 1,
  } as ConcurrencyFunction);

  const schedulesActionConfigWithStartAndEndTime = (startTime?: string, endTime?: string) => ({
    concurrencyAutoscaling: {
      ...configMin,
      scheduledActions: [{
        ...customScheduledAction('name', 'cron(30 8 ? * 1-6 *)', { minimum: 1 }),
        startTime,
        endTime
      }] as ScheduledAction[]
    },
    provisionedConcurrency: 1,
  } as ConcurrencyFunction);
});
