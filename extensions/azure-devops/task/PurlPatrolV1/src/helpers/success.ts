import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', '/index.js');

let sbomDir: string;
sbomDir = "./test_data/secobserve.cdx.json";

let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('SBOMPATH', sbomDir);

// we do not want the absolute path since this is used in the volume of the docker run cmd below
tmr.registerMock('path', {
    resolve: (p: string) => p,
    dirname: (p: string) => path.dirname(p),
    basename: (p: string) => path.basename(p),
    join: (...paths: string[]) => path.join(...paths),
});

// we need to mock the external requests to the task runner of Azure
const a: ma.TaskLibAnswers = {
    checkPath: {
        [sbomDir]: true
    },
    exec: {
        'docker run --workdir /workspace/sbom --rm --env SBOM_PATH=/workspace/sbom/secobserve.cdx.json --env BREAK_ENABLED=true --volume ./test_data:/workspace/sbom ghcr.io/maibornwolff/purl-patrol:latest': {
            "code": 0,
            "stderr": "no error",
            "stdout": "Docker ran successfully"
        }
    }
}

tmr.setAnswers(a);
tmr.run();
