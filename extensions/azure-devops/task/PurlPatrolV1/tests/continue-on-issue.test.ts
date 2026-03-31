import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {describe, it, before} from 'node:test';


const dirname = "./dist/helpers/"
describe('The docker container returns a license issue and the task should continue', function () {
    let tr: ttm.MockTestRunner;

    before(async function() {
        let tp = path.join(dirname, 'continue-on-issue.js');
        tr = new ttm.MockTestRunner(tp);
        await tr.runAsync();
    });

    it("should have ran", function() {
        assert.ok(tr.ran);
    });

    it("should succeed despite license issue", function() {
        assert.equal(tr.succeeded, true);
    });

    it("should have no error issues", function() {
        assert.equal(tr.errorIssues.length, 0);
    });

    it("should not have PURL Patrol failure error", function() {
        // This uses the 0th element which doesn't exist if the array is empty
        // It's better to check that there are no error messages with 'PURL Patrol execution failed' in them
        assert.ok(!tr.errorIssues.some(issue => issue.includes("PURL Patrol execution failed")));
    });

    it("should display message about continuing despite failure", function() {
        assert.equal(tr.stdout.includes('PURL Patrol execution failed, but continuing as BREAK=false: undefined'), true);
    });

    it("should have no warnings", function() {
        assert.deepEqual(tr.warningIssues, []);
    });

    it("should display 'Running PURL Patrol...'", function() {
        assert.equal(tr.stdout.includes('Running PURL Patrol...'), true);
    });

    it("should not display 'PURL Patrol completed successfully'", function() {
        assert.equal(tr.stdout.includes('PURL Patrol completed successfully'), false);
    });
});
