const { exec } = require("child_process");

let frame = 0;

const cp = exec(`"D:\\Autodesk Maya 2020.3\\Maya2020\\bin\\Render.exe" -s ${frame} -e ${frame} D:\\Maya\\Earth\\scenes\\Earth.ma`, (error, stdout, stderr) => {
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
