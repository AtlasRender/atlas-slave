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

/**
 * ReportTypes - render task report types.
 */
export type ReportTypes = "info" | "warning" | "error";

/**
 * SendTaskReportSettings - settings for task report payload.
 * @interface
 * @author Danil Andreev
 */
export interface SendTaskReportSettings {
    action?: "start" | "report" | "finish";
}

/**
 * RabbitMQ - class, designed to handle RabbitMQ queues.
 * @class
 * @author Danil Andreev
 */
export default class RabbitMQ {
    /**
     * connection - RabbitMQ connection object.
     */
    public static connection: Amqp.Connection;
    /**
     * renderTasksChannel - RabbitMQ render tasks channel.
     */
    public static renderTasksChannel: Amqp.Channel;

    /**
     * Creates an instance of RabbitMQ.
     * @constructor
     * @param config
     * @throws Error
     * @author Danil Andreev
     */
    public constructor(config: Amqp.Options.Connect) {
        RabbitMQ.init(config).then().catch(error => {
            throw error;
        });
    }

    /**
     * init - initializes RabbitMQ class, connects to queues.
     * @method
     * @param config - Configuration for init.
     * @author Danil Andreev
     */
    public static async init(config: Amqp.Options.Connect): Promise<void> {
        RabbitMQ.connection = await Amqp.connect(config);
        RabbitMQ.renderTasksChannel = await RabbitMQ.connection.createChannel();

        // Consuming render task
        await RabbitMQ.renderTasksChannel.assertQueue(AMQP_TASKS_QUEUE);
        await RabbitMQ.renderTasksChannel.prefetch(1);
        await RabbitMQ.renderTasksChannel.consume(AMQP_TASKS_QUEUE, async (message: Amqp.Message) => {
            // console.log("Got render task from queue.");
            let renderTask: any = null;
            try {
                renderTask = JSON.parse(message.content.toString());
                await this.sendTaskStartReport(renderTask.id);
                await RenderDispatcher.doRenderTask(renderTask);
                await this.sendTaskFinishReport(renderTask.id);
                RabbitMQ.renderTasksChannel.ack(message);
                // TODO: Add result to queue.
            } catch(error) {
                await this.sendTaskFinishReport(renderTask.id, "failed", {message: error.message});
                RabbitMQ.renderTasksChannel.nack(message);
            }
        });
    }

    /**
     * sendTaskReport - sends task report to RabbitMQ queue.
     * @method
     * @param taskId - Task id this message refers to.
     * @param type - Report type.
     * @param message - Report message payload.
     * @param settings - Report settings.
     * @author Danil Andreev
     */
    public static async sendTaskReport(taskId: number, type: ReportTypes, message: object, settings: SendTaskReportSettings = {}): Promise<void> {
        const {
            action = "report"
        } = settings;
        const payload = {
            action,
            slave: "hero11",
            reportType: type,
            task: taskId,
            data: message,
        }
        const channel: Amqp.Channel = await RabbitMQ.connection.createChannel();
        await channel.assertQueue(AMQP_REPORTS_QUEUE);
        await channel.sendToQueue(AMQP_REPORTS_QUEUE, Buffer.from(JSON.stringify(payload)));
        await channel.close();
    }

    /**
     * sendTaskStartReport - sends render task start report.
     * @method
     * @param taskId - Task id this message refers to.
     * @author Danil Andreev
     */
    protected  static async sendTaskStartReport(taskId: number): Promise<void> {
        await RabbitMQ.sendTaskReport(taskId, "info", {}, {action: "start"});
    }

    /**
     * sendTaskFinishReport - sends render task finish report.
     * @method
     * @param taskId - Task id this message refers to.
     * @param status - Task finish status.
     * @param message - Task finish message
     * @author Danil Andreev
     */
    protected  static async sendTaskFinishReport(taskId: number, status: "failed" | "done" = "done", message: object = {}): Promise<void> {
        await RabbitMQ.sendTaskReport(taskId, status === "failed" ? "error" : "info", message, {action: "finish"});
    }
}
