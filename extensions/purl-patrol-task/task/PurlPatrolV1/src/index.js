import * as tl from 'azure-pipelines-task-lib';
import * as path from 'path';
// const path = require('path');

// TODO: dependencies in dist

async function run() {
    try {
        const workingDir = "/workspace";
        // the directories must be separated in case the user has the license 
        // and sbom in the same directory
        const licenseDirDocker = "license";
        const sbomDirDocker = "sbom";
        
        // Get inputs
        let sbomPath = tl.getInput('SBOMPATH', true);
        // let sbomPath = './test_data/secobserve.cdx.json';
        let licensePolicyPath = tl.getInput('LICENSEPOLICYPATH', false);
        let breakOnNonCompliance = tl.getInput('BREAK', false);
        
        sbomPath = path.resolve(sbomPath);
        
        // Validate inputs
        tl.checkPath(sbomPath);
        if (Boolean(licensePolicyPath)){
            licensePolicyPath = path.resolve(licensePolicyPath);
            tl.checkPath(licensePolicyPath)
        }
        
        const sbomDir = path.dirname(sbomPath);
        const sbomFile = path.basename(sbomPath);
        if (!Boolean(breakOnNonCompliance)){
            breakOnNonCompliance = "true";
        }
        
        // TODO: Pin Version of Dockerfile
        const docker = tl.tool('docker');
        docker.arg(["run", "--workdir", `${path.join(workingDir, sbomDirDocker)}`, "--rm"]);
        docker.arg(["--env", `SBOM_PATH=${path.join(workingDir, sbomDirDocker, sbomFile)}`])
        docker.arg(["--env", `BREAK_ENABLED=${breakOnNonCompliance}`])
        docker.arg(["--volume", `${sbomDir}:${path.join(workingDir, sbomDirDocker)}`])
        if (Boolean(licensePolicyPath)){
            const licenseDir = path.dirname(licensePolicyPath);
            const licenseFile = path.basename(licensePolicyPath);
            docker.arg([`--env LICENSE_POLICY_PATH="${path.join(workingDir, licenseDirDocker, licenseFile)}"`]);
            docker.arg([`--volume ${licenseDir}:${path.join(workingDir, licenseDirDocker)}`]);
        } 
        docker.arg([`ghcr.io/maibornwolff/purl-patrol:latest`])
        
        // Run purl-patrol Docker image
        console.log('Running PURL Patrol...');
        try {        
            await docker.execAsync();
            console.log('PURL Patrol completed successfully');
        } catch (error) {
            if (breakOnNonCompliance=="true") {
                throw new Error(`PURL Patrol execution failed: ${error.stderr}`);
            } else {
                console.log(`PURL Patrol execution failed, but continuing as BREAK=false: ${error.stderr}`);
            }
        }
        
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

run();
