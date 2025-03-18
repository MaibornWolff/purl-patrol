import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join('./dist/', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('SBOMPATH', './test_data/secobserve.cdx.json');
tmr.setInput('BREAK', 'true');

tmr.registerMock('azure-pipelines-task-lib/task', {
    checkPath: function(p: string) {
        return;
    },
    tool: function(tool: string) {
        return {
            arg: function(args: string[]) { return this; },
            execAsync: function() { return Promise.resolve(0); }
        };
    },
    setResult: function(result: any, message: string) {
        console.log('Task result: ' + result);
    }
});

tmr.run();
