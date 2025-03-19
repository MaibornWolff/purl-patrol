import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

import {describe, it} from 'node:test';


const dirname = "./dist/helpers/"
describe('loading the pipeline task successfully with only required inputs', function () {
    let tr: ttm.MockTestRunner;
    let tp = path.join(dirname, 'success.js');
    tr = new ttm.MockTestRunner(tp); 

    it("should run successfully", {timeout:5000}, async() => {
        await tr.runAsync();
        assert.equal(tr.succeeded, true, 'The task should have succeeded');
        assert.equal(tr.stdout.includes("Docker ran successfully"), true, 'Should have contained the string "Docker ran successfully' )
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.stdout.indexOf('Running PURL Patrol...') >= 0, true, "should display Running PURL Patrol...");
        assert.equal(tr.stdout.indexOf('PURL Patrol completed successfully') >= 0, true, "should display PURL Patrol completed successfully");
    });
});

