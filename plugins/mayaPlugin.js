/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Allison
 * Project: atlas-slave
 * File last modified: 29.11.2020, 23:54
 * All rights reserved.
 */

const { exec } = require("child_process");

const cp = exec("D: && cd \\Autodesk Maya 2020.3\\Maya2020\\bin && render \\Maya\\Earth\\scenes\\Earth.ma --background --python \\Maya\\maya_script\\main.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    // console.log(`stdout: ${stdout}`);
});
cp.stdout.on("data", (data) => {console.log(data)});
