/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 17.10.2020, 23:39
 * All rights reserved.
 */


import * as Amqp from "amqplib";
import config from "./config";

async function RabbitMQ(): Promise<void> {
    const amqp: Amqp.Connection = await Amqp.connect(config.rabbit);

    const channel: Amqp.Channel = await amqp.createChannel()

    channel.assertQueue("tasks").then((input) => {
        const message = {
            name: "slave",
            description: "hello",
        };
        console.log(message);
        channel.sendToQueue("tasks", Buffer.from(JSON.stringify(message)));
    });
}

RabbitMQ().then();
