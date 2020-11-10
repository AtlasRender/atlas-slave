/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 18.10.2020, 19:12
 * All rights reserved.
 */

import RabbitMQ from "./RabbitMQ";

const { exec } = require("child_process");

const plugin = "const { exec } = require(\"child_process\");\n" +
    "\n" +
    "exec(\"D: && cd \\\\Steam\\\\steamapps\\\\common\\\\Blender && blender Projects\\\\bugatti\\\\bugatti.blend --background --python Projects\\\\script1\\\\main.py\", (error, stdout, stderr) => {\n" +
    "    if (error) {\n" +
    "        console.log(`error: ${error.message}`);\n" +
    "        return;\n" +
    "    }\n" +
    "    if (stderr) {\n" +
    "        console.log(`stderr: ${stderr}`);\n" +
    "        return;\n" +
    "    }\n" +
    "    console.log(`stdout: ${stdout}`);\n" +
    "});";
const settings = "";
const task = {
    "plugin": plugin,
    "settings": ""
}

export default class RenderDispatcher {
    public static sendReport(message: any) {

    }

    public static async doRenderTask(task): Promise<void> {
        console.log(task["plugin"]);
        // for (let i = 0; i < 3; i++) {
        //     await RabbitMQ.sendTaskReport(task.id, "info", {text: "rendering" + i, task});
        // }
        // await RabbitMQ.sendTaskReport(task.id, "info", {text: "finish", task});
        eval(task["plugin"]);
    }
}

RenderDispatcher.doRenderTask(task).then(r => console.log("finish"));
