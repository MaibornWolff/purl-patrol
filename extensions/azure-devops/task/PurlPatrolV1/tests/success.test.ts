import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

import {describe, it, beforeEach} from 'node:test';


const dirname = "./dist/helpers/"
describe('loading the pipeline task successfully with all inputs', function () {
    let tr: ttm.MockTestRunner;
    let tp = path.join(dirname, 'success.js');
    tr = new ttm.MockTestRunner(tp); 

    it("should run successfully", {timeout:5000}, async() => {
        await tr.runAsync();
        const stderr = tr.stderr;
        const stdout = tr.stdout;
        assert.equal(stdout, "foo")
        // add additional assert 
        
        // assert.equal(tr.succeeded, true, 'should have succeeded');
        // assert.equal(stdout, "foo")
    });
});

