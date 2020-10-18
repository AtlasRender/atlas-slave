/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-slave
 * File last modified: 18.10.2020, 17:09
 * All rights reserved.
 */


import * as moment from "moment";

/**
 * Logger - console logger.
 * @class
 * @author Danil Andreev
 */
export default class Logger {
    /**
     * warn - console.warn with timestamp.
     * @method
     * @param message Message to display
     * @author Danil Adnreev
     */
    public static warn(...message: string[]): string {
        const value = `[${moment().format("lll")}] ${message.join(" ")}`;
        console.warn(value);
        return value;
    }

    /**
     * log - console.log with timestamp.
     * @method
     * @param message Message to display
     * @author Danil Adnreev
     */
    public static log(...message: string[]): string {
        const value = `[${moment().format("lll")}] ${message.join(" ")}`;
        console.log(value);
        return value;
    }

    /**
     * error - console.error with timestamp.
     * @method
     * @param message Message to display
     * @author Danil Adnreev
     */
    public static error(...message: string[]): string {
        const value = `[${moment().format("lll")}] ${message.join(" ")}`;
        console.error(value);
        return value;
    }
}
