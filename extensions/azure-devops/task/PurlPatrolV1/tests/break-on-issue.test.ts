import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {describe, it, before} from 'node:test';


const dirname = "./dist/helpers/"
describe('The docker container returns a license issue and the task should fail', function () {
    let tr: ttm.MockTestRunner;
    
    before(async function() {
        let tp = path.join(dirname, 'break-on-issue.js');
        tr = new ttm.MockTestRunner(tp);
        await tr.runAsync();
    });
    
    it("should have ran", function() {
        assert.ok(tr.ran);
    });
    
    it("should fail due to license issue", function() {
        assert.equal(tr.failed, true);
    });
    
    it("should have exactly one error issue", function() {
        assert.equal(tr.errorIssues.length, 1);
    });
    
    it("should have error about PURL Patrol execution failing", function() {
        assert.equal(tr.errorIssues[0], "PURL Patrol execution failed: undefined");
    });
    
    it("should not show Docker ran successfully", function() {
        assert.equal(tr.stdout.includes("Docker ran successfully"), false);
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

