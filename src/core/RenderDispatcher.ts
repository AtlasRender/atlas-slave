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


// let scriptSettings = fs.readFileSync('plugins/blenderScriptSettings.py', 'utf8');
// let scriptRender = fs.readFileSync('plugins/blenderScriptRender.py', 'utf8');

export default class RenderDispatcher {
    public static sendReport(message: any) {

    }

    public static async doRenderTask(task): Promise<void> {
        try {
             const result = await new Promise((resolve, reject) => {
                let sendReport = (type: ReportTypes, message: object, settings: SendTaskReportSettings = {}) =>
                    RabbitMQ.sendTaskReport(task.id, type, message, settings);

                function finishJob(status: "error" | "done", message: any){
                    if(status !== "error" && status !== "done")
                        throw new TypeError(`Invalid type of 'status', expected "'error' | 'done'", got "${status}".`);
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

                let frame = task.frame;

                let sandbox = {
                    finishJob,
                    sendReport,
                    frame,
                    require,
                    console
                };


                console.log(task);
                console.log("rendering task frame", task.frame);


                // let script = scriptSettings + '\nframe = ' + frame + '\n' + scriptRender;
                // console.log(script);
                // fs.writeFileSync('../../Steam/steamapps/common/Blender/Projects/script1/blender_script.py', script);

                vm.runInNewContext(task.job.plugin.script, sandbox);
                // await RabbitMQ.sendTaskReport(task.id, "info", {text: "finish", task});
            });
        } catch (error) {
            //TODO: handler error
        }
    }
}

// export default class RenderDispatcher {
//     public static sendReport(message: any) {
//
//     }
//
//     public static async doRenderTask(task): Promise<void> {
//         console.log(task);
//         for (let i = 0; i < 3; i++) {
//             await RabbitMQ.sendTaskReport(task.id, "info", {text: "rendering" + i, task});
//         }
//         await RabbitMQ.sendTaskReport(task.id, "info", {text: "finish", task});
//     }
// }
