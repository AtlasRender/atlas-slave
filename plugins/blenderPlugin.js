const {exec} = require("child_process");


let pathToBlender = `\\Steam\\steamapps\\common\\Blender`;
console.log(pathToBlender);
let pathToBlenderScene = `Projects\\bugatti\\bugatti.blend`;
let frame = 0
let timeAll = 0;
console.log("plugin begin render task");
console.log(frame);
// D: && cd Steam\steamapps\common\Blender && blender --verbose 4 Projects\bugatti\bugatti.blend --background --python Projects\script1\blender_script.py -- 0
// `D: && cd \\Steam\\steamapps\\common\\Blender && blender --verbose 4 Projects\\bugatti\\bugatti.blend --background --python Projects\\script1\\blender_script.py -- ${frame}`
const cp = exec(`D: && cd ${pathToBlender} && blender --verbose 4 ${pathToBlenderScene} --background --python Projects\\script1\\blender_script.py -- ${frame}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log("100%\nfinish render");
    finishJob("done", "render finished!");
    // console.log(`stdout: ${stdout}`);
});
console.log("Prepare for rendering!");
cp.stdout.on("data", async (data) => {
    // console.log(data);
    const cols = data.split("|");
    // console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].includes(" Path Tracing Sample 2/100\n")) {
            for (let j = 0; j < cols.length; j++) {
                if (cols[j].includes("Remaining")) {
                    let min1 = +cols[j].substr(11, 2);
                    let sec1 = +cols[j].substr(14, 2);
                    let ms1 = +cols[j].substr(17, 2);
                    timeAll = (min1 * 60000) + (sec1 * 1000) + ms1;
                }
            }
        }
    }
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].includes("Remaining")) {
            let min2 = +cols[i].substr(11, 2);
            let sec2 = +cols[i].substr(14, 2);
            let ms2 = +cols[i].substr(17, 2);
            let timeNow = (min2 * 60000) + (sec2 * 1000) + ms2;
            // console.log(`${(100 - (timeNow / timeAll) * 100).toFixed(2)}%`);
            await sendReport("info", {Processing: `${(100 - (timeNow / timeAll) * 100).toFixed(2)}%`});
        }
    }
});
