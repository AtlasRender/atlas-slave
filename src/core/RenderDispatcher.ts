/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 18.10.2020, 19:12
 * All rights reserved.
 */

import RabbitMQ from "./RabbitMQ";

export default class RenderDispatcher {
    public static sendReport(message: any) {

    }

    public static async doRenderTask(task): Promise<void> {
        console.log(task);
        for (let i = 0; i < 3; i++) {
            await RabbitMQ.sendTaskReport({text: "rendering" + i, task});
        }
        await RabbitMQ.sendTaskReport({text: "finish", task});
    }
}
