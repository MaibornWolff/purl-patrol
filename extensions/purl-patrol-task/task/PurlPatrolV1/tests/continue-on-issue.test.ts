import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

import {describe, it} from 'node:test';


const dirname = "./dist/helpers/"
describe('The docker container returns a license issue and the task should continue', function () {
    let tr: ttm.MockTestRunner;
    let tp = path.join(dirname, 'continue-on-issue.js');
    tr = new ttm.MockTestRunner(tp); 

    it("should continue despite license issue", {timeout:5000}, async() => {
        await tr.runAsync();
        assert.equal(tr.succeeded, true, 'The task should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have 0 error issue");
        assert.notEqual(tr.errorIssues[0], "PURL Patrol execution failed: undefined", "Error message should not include that PURL patrol failed");
        assert.equal(tr.stdout.indexOf('PURL Patrol execution failed, but continuing as BREAK=false: undefined') >= 0, true, "should display message about continuing");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.stdout.indexOf('Running PURL Patrol...') >= 0, true, "should display Running PURL Patrol...");
        assert.notEqual(tr.stdout.indexOf('PURL Patrol completed successfully') >= 0, true, "should not display PURL Patrol completed successfully");
    });
});

 