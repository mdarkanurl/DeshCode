import * as amqplib from 'amqplib';
import { ProblemTypes } from '../../generated/prisma';
import { JavaScript } from '../language/javascrypt/route-types';

type LanguageExecutor = (
  channel: amqplib.Channel,
  msg: amqplib.ConsumeMessage,
  data: {
    submissionId: number;
    functionName: string;
    testCases: any[];
    code: string;
    ProblemType: ProblemTypes;
  }
) => Promise<void>;

export const languageExecutors: Record<string, LanguageExecutor> = {
  javascript: JavaScript,
};
