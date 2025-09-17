// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globalSetup: "./src/__tests__/setup.ts",
  globalTeardown: "./src/__tests__/teardown.ts",
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.test.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;