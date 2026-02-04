import { write } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'node:path';
 
// Get package name
let packageName = process.argv[2];

if(packageName) {
    console.log("Reading " + packageName);
} else {
    console.log("Reading local package.json");
    packageName = "package.json";
}

function checkVersion(dependency) {
    let versionType = "";
    if (Array.from(dependency)[0] === "^") {versionType = "Patch release"}
    else if (Array.from(dependency)[0] === "~") {versionType = "Minor release"}
    else {versionType = "Major release"}
    return versionType;
}

// Read package
try {
    const packageContent = await readFile(packageName, 'utf-8');
    const parsedContent = JSON.parse(packageContent);
    // Get data
    const name = parsedContent["name"];
    const version = parsedContent["version"];
    const prodDependencies = parsedContent["dependencies"];
    const devDependencies = parsedContent["devDependencies"];
    const scripts = parsedContent["scripts"];
    // Organised data
    let summary = "---------------\nReport analysis\n---------------\nName: " + name + "\nVersion: " + version + "\n";
    summary += "\nProduction dependencies:\n"
    for (const [key, value] of Object.entries(prodDependencies)) {
        const versionType = checkVersion(value);
        summary += "   - " + key + "\t" + value + " (" + versionType + ")\n"
    }
    summary += "\nDevelopment dependencies:\n"
    for (const [key, value] of Object.entries(devDependencies)) {
        const versionType = checkVersion(value);
        summary += "   - " + key + "\t" + value + " (" + versionType + ")\n"
    }
    summary += "\nScripts:\n"
    for (const [key, value] of Object.entries(scripts)) {
        summary += "   - " + key + "\t" + value + "\n"
    }
    console.log(summary);
    // Write data
    //await writeFile("analysis-report.json", summary);
} catch (e) {
    console.error(e);
}