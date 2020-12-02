/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 18.10.2020, 19:12
 * All rights reserved.
 */

import RabbitMQ, {ReportTypes, SendTaskReportSettings} from "./RabbitMQ";
import * as vm from "vm";


/**
 * RenderDispatcher - class, designed to handle render plugin executing.
 * @class
 * @author Danil Andreev, Liskovych Anton
 */
export default class RenderDispatcher {
    public static doRenderTask(task): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            async function sendReport(type: ReportTypes, message: object, settings: SendTaskReportSettings = {}): Promise<void> {
                await RabbitMQ.sendTaskReport(task.id, type, message, settings);
            }
            function finishJob(status: "error" | "done", message?: any): void {
                console.log(message);
                switch (status) {
                    case "done":
                        resolve(message);
                        break;
                    case "error":
                        reject(message);
                        break;
                    default:
                        throw new TypeError(`Invalid type of 'status', expected "'error' | 'done'", got "${status}".`);
                }
            }

            const sandbox = {
                pathToBlender: task.job.pluginSettings.pathToBlender,
                pathToBlenderScene: task.job.pluginSettings.pathToBlenderScene,
                finishJob,
                sendReport,
                frame: task.frame,
                require,
                console
            };

            console.log(task);
            console.log("rendering task frame", task.frame);

            vm.runInNewContext(task.job.plugin.script, sandbox);
        });
    }
}
