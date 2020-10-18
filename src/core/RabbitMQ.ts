/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 18.10.2020, 19:17
 * All rights reserved.
 */


import * as Amqp from "amqplib";
import {AMQP_REPORTS_QUEUE, AMQP_TASKS_QUEUE} from "../globals";
import RenderDispatcher from "./RenderDispatcher";

export default class RabbitMQ {
    public static connection: Amqp.Connection;
    public static renderTasksChannel: Amqp.Channel;
    public static taskReportConnection: Amqp.Channel;


    public constructor(config: Amqp.Options.Connect) {
        RabbitMQ.init(config).then().catch(error => {
            throw error;
        });
    }

    public static async init(config: Amqp.Options.Connect): Promise<void> {
        RabbitMQ.connection = await Amqp.connect(config);
        RabbitMQ.renderTasksChannel = await RabbitMQ.connection.createChannel();
        RabbitMQ.taskReportConnection = await RabbitMQ.connection.createChannel();

        // Consuming render task
        await RabbitMQ.renderTasksChannel.assertQueue(AMQP_TASKS_QUEUE);
        await RabbitMQ.renderTasksChannel.prefetch(1);
        await RabbitMQ.renderTasksChannel.consume(AMQP_TASKS_QUEUE, (message: Amqp.Message) => {
            let renderTask: any = null;
            try {
                renderTask = JSON.parse(message.content.toString());
            } catch (error) {
                // TODO: handle invalid message.
            }
            RenderDispatcher.doRenderTask(renderTask);
        });
    }

    public static async sendTaskReport(message: any): Promise<void> {
        this.taskReportConnection.sendToQueue(AMQP_REPORTS_QUEUE, Buffer.from(message));
    }
}