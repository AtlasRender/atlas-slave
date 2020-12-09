const {exec} = require("child_process");

let frame = 0;
let renumbered = 5;
let env = {
    pathToBlender: "D:\\Steam\\steamapps\\common\\Blender",
    pathToMaya: "D:\\Autodesk Maya 2020.3\\Maya2020\\bin"
};
let pluginSettings = {
    pathToMayaScene: "D:\\Maya\\Earth\\scenes\\Earth.ma",
    threads: 0,
    resolutionX: 1920,
    resolutionY: 1080
};


// -vs  volume shading samples

const command = [
    `"${env.pathToMaya}\\Render.exe" -r arnold -ai:lve 3 `,
    `-s ${frame} -e ${frame} -x ${pluginSettings.resolutionX} -y ${pluginSettings.resolutionY} -ai:threads ${pluginSettings.threads} `,
    `${pluginSettings.pathToMayaScene}`
].join("");

const cp = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    console.log("\nfinish render");
    // finishJob("done", "render finished!");
    // console.log(`stdout: ${stdout}`);
});
console.log("Prepare for rendering!");
cp.stdout.on("data", async (data) => {
    const cols = data.split("|");
    console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].includes("% don")) {
            console.log(cols[i].substr(2, 4));
            // await sendReport("info", {Processing: `${cols[i].substr(2, 4)}`});
        }
    }
    // await sendReport("info", {message: data});
});
