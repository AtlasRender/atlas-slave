const {exec} = require("child_process");

let frame = 1;
let renumbered = 5;
let env = {
    pathToBlender: "D:\\Steam\\steamapps\\common\\Blender",
    pathToMaya: "D:\\Autodesk Maya 2020.3\\Maya2020\\bin"
};
let pluginSettings = {
    pathToMayaScene: "D:\\Maya\\Earth\\scenes\\Earth.ma",
    outputFolder: "C:\\MayaProjects\\",
    threads: 0,
    resolutionX: 1920,
    resolutionY: 1080
};

const pathToMaya = env.pathToMaya.replace(/"/g, "\\\"");
const pathToMayaScene = pluginSettings.pathToMayaScene.replace(/"/g, "\\\"");
const threads = pluginSettings.threads;
const resolutionX = pluginSettings.resolutionX;
const resolutionY = pluginSettings.resolutionY;
const outputFolder = pluginSettings.outputFolder;

const command = [
    `"${pathToMaya}\\Render.exe" -r arnold -ai:lve 3 `,
    `-preRender "setAttr "defaultRenderGlobals.modifyExtension" 1; setAttr "defaultRenderGlobals.startExtension" ${renumbered};" `,
    `-rd ${outputFolder} `,
    `-s ${frame} -e ${frame} -x ${resolutionX} -y ${resolutionY} -ai:threads ${threads} `,
    `"${pathToMayaScene}"`
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
        if (cols[i].includes("% d")) {
            console.log(cols[i].substr(2, 4));
            if(!isNaN(cols[i].substr(2, 3))){
                console.log(cols[i].substr(2, 3));
                // await sendReport("info", {Processing: `${cols[i].substr(2, 4)}`});
            }
        }
    }
    // await sendReport("info", {message: data});
});
