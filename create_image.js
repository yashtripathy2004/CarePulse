import fs from "fs";

const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
fs.writeFileSync("d:/Users/OCTANE/Desktop/resume project/doctor appointment/avatar.png", Buffer.from(base64Data, "base64"));
console.log("Mock avatar image created successfully");
