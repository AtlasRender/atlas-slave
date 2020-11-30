const { exec } = require("child_process");

console.log("plugin begin render task");
console.log(count);
func();

const cp = exec("D: && cd \\Steam\\steamapps\\common\\Blender && blender Projects\\bugatti\\bugatti.blend --background --python Projects\\script1\\blender_script.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log("finish render");
    // console.log(`stdout: ${stdout}`);
});
// cp.stdout.on("data", (data) => {console.log(data)});

