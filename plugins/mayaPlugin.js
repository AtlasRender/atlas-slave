const {exec} = require("child_process");

let frame = 0;

const cp = exec(`"D:\\Autodesk Maya 2020.3\\Maya2020\\bin\\Render.exe" -r arnold -ai:lve 3 -s ${frame} -e ${frame} D:\\Maya\\Earth\\scenes\\Earth.ma`, (error, stdout, stderr) => {
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
    // console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].includes("%") && cols[i].includes("rays/pixel")) {
            console.log(cols[i].substr(2, 4));
            // await sendReport("info", {Processing: `${cols[i].substr(2, 4)}`});
        }
    }
});
