import { Logging, Progress } from "serverless/classes/Plugin";

function fakeLog(..._args: any[]) {
    return;
}

const fakeProgress: Progress = {
    namespace: "Testing",
    name: "Test Progress",
    update: function (_message: string): void {
        throw new Error("Function not implemented.");
    },
    info: function (_message: string): void {
        throw new Error("Function not implemented.");
    },
    notice: function (_message: string): void {
        throw new Error("Function not implemented.");
    },
    remove: function (): void {
        throw new Error("Function not implemented.");
    }
}

export const mockLogging: Logging = {
        log: {
            error: fakeLog,
            warning: fakeLog,
            notice: fakeLog,
            info: fakeLog,
            debug: fakeLog,
            verbose: fakeLog,
            success: fakeLog,
        },
        writeText: (_text: string | string[]) => {},
        progress: {
            get: (_name: string) => fakeProgress,
            create: (_args: { message?: string; name?: string }) => fakeProgress,
        },
    };