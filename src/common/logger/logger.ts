/* eslint-disable import/no-named-as-default */
import { LoggerService } from '@nestjs/common';
import pino, { Level, Logger as Pino } from 'pino';

const pinoOptions = {
    formatters: {
        level: (label: string): { level: string } => {
            return { level: label };
        },
    },
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'hostname,pid',
            singleLine: true, // True = Json, False = Pretty
        },
    },
};

export class Logger implements LoggerService {
    private static _instance: typeof Logger = Logger;
    private static _pino: Pino = pino(pinoOptions);

    static bootstrap(): typeof Logger {
        this._pino = pino({
            ...pinoOptions,
        });

        return this;
    }

    static create(): LoggerService {
        return new Logger();
    }

    private get instance(): typeof Logger {
        const { _instance }: typeof Logger = Logger;
        return _instance;
    }

    log(message: any) {
        this.instance.log(message);
    }
    error(message: any) {
        this.instance.error(message);
    }
    warn(message: any) {
        this.instance.warn(message);
    }

    static log(message: string, obj?: Record<string, unknown>): void {
        this.callPino('info', { ...obj }, message);
    }

    static error(message: string, obj?: Record<string, unknown>): void {
        this.callPino('error', { ...obj }, message);
    }

    static warn(message: string, obj?: Record<string, unknown>): void {
        this.callPino('warn', { ...obj }, message);
    }

    private static callPino(level: Level, obj: Record<string, unknown>, msg?: string): void {
        this._pino[level]({ ...obj }, msg);
    }
}
