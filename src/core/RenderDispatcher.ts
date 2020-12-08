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
import * as fs from "fs";
import * as os  from "os";


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

            let data = require('../../plugins/slave_env.json');
            console.log(data.pathToBlender);


            const sandbox = {
                pathToBlender: data.pathToBlender,
                pathToBlenderScene: task.job.pluginSettings.pathToBlenderScene,
                samples: task.job.pluginSettings.samples,
                resolutionX: task.job.pluginSettings.resolutionX,
                resolutionY: task.job.pluginSettings.resolutionY,
                finishJob,
                sendReport,
                frame: task.frame,
                renumbered: task.renumbered,
                require,
                console
            };

            console.log(task);
            console.log(task.renumbered);
            console.log("rendering task frame", task.frame);

            vm.runInNewContext(task.job.plugin.script, sandbox);
        });
    }
}
