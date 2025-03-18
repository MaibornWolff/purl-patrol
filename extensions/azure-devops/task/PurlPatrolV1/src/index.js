import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
// const path = require('path');

// TODO: dependencies in dist

async function run() {
    try {
        // Get inputs
        const workingDir = "/workspace";
        const licenseDirDocker = "license";
        const sbomDirDocker = "sbom";
        
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
        docker.arg(["run", "--workdir", `${workingDir}`, "--rm"]);
        docker.arg(["--env", `SBOM_PATH=${path.join(workingDir, sbomDirDocker, sbomFile)}`])
        docker.arg(["--env", `BREAK_ENABLED="${breakOnNonCompliance}"`])
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
            if (breakOnNonCompliance) {
                throw new Error(`PURL Patrol found compliance issues: ${error.message}`);
            } else {
                console.log(`PURL Patrol found compliance issues, but continuing as BREAK=false: ${error.message}`);
            }
        }
        
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

run();
