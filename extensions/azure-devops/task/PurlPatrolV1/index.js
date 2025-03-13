const tl = require('azure-pipelines-task-lib/task');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function run() {
    try {
        // Get inputs
        const workingdir = "/workspace/";
        
        let sbomPath = tl.getInput('SBOMPATH', true);
        let licensePolicyPath = tl.getInput('LICENSEPOLICYPATH', false);
        let breakOnNonCompliance = tl.getBoolInput('BREAK', false);

        // Validate inputs
        if (!fs.existsSync(sbomPath)) {
            throw new Error(`SBOM file not found at path: ${sbomPath}`);
        }

        sbomPath = path.join(workingdir, sbomPath);

        if (!Boolean(breakOnNonCompliance)){
            breakOnNonCompliance = "true";
        }

        const sbomDir = path.dirname(sbomPath);
        
        let command;
        // TODO: Pin Version of Dockerfile
        if (Boolean(licensePolicyPath)){
            licensePolicyPath = path.join(workingdir, licensePolicyPath);
            const licenseDir = path.dirname(licensePolicyPath);
            command = `docker run --rm --workingdir "${workingdir}" -e SBOM_PATH="${sbomPath}" -e BREAK_ENABLED="${breakOnNonCompliance}" -e LICENSE_POLICY_PATH="${licensePolicyPath}" -v "${sbomDir}:${path.join(workingdir, sbomDir)}" -v "${licenseDir}:${licenseDir}" ghcr.io/maibornwolff/purl-patrol:latest`;
        } else {
            command = `docker run --rm --workingdir "${workingdir}" -e SBOM_PATH="${sbomPath}" -e BREAK_ENABLED="${breakOnNonCompliance}" -v "${sbomDir}:${path.join(workingdir, sbomDir)}" ghcr.io/maibornwolff/purl-patrol:latest`;
        }

        
        // Run purl-patrol Docker image
        console.log('Running PURL Patrol...');
        try {
            console.log(`Executing command: ${command}`);
            
            const output = execSync(command, { encoding: 'utf-8' });
            console.log(output);
            
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
