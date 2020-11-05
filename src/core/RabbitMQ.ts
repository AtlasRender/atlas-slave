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
import set = Reflect.set;

export type ReportTypes = "info" | "warning" | "error";

export interface SendTaskReportSettings {
    action?: "start" | "report" | "finish";
}

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
        await RabbitMQ.renderTasksChannel.consume(AMQP_TASKS_QUEUE, async (message: Amqp.Message) => {
            console.log("Got render task from queue.");
            let renderTask: any = null;
            try {
                renderTask = JSON.parse(message.content.toString());
            } catch (error) {
                // TODO: handle invalid message.
            }
            try {
                await this.sendTaskStartReport(renderTask.id);
                await RenderDispatcher.doRenderTask(renderTask);
                RabbitMQ.renderTasksChannel.ack(message);
                await this.sendTaskFinishReport(renderTask.id);
                // TODO: Add result to queue.
            } catch(error) {
                await this.sendTaskFinishReport(renderTask.id, "failed", {message: error.message});
            }
        });
    }

    public static async sendTaskReport(taskId: number, type: ReportTypes, message: object, settings: SendTaskReportSettings =  {}): Promise<void> {
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

        console.log("REPORT PAYLOAD -----------------------------------------------------");
        console.log(payload);
        console.log("REPORT PAYLOAD END -------------------------------------------------");
        await RabbitMQ.taskReportConnection.assertQueue(AMQP_REPORTS_QUEUE);
        await RabbitMQ.taskReportConnection.sendToQueue(AMQP_REPORTS_QUEUE, Buffer.from(JSON.stringify(payload)));
    }

    protected  static async sendTaskStartReport(taskId: number): Promise<void> {
        await RabbitMQ.sendTaskReport(taskId, "info", {}, {action: "start"});
    }

    protected  static async sendTaskFinishReport(taskId: number, status: "failed" | "done" = "done", message: object = {}): Promise<void> {
        await RabbitMQ.sendTaskReport(taskId, status === "failed" ? "error" : "info", message, {action: "finish"});
    }
}