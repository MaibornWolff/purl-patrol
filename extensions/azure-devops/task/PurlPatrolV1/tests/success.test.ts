import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test.js';

import {describe, it, beforeEach} from 'node:test';


const dirname = "./dist/helpers/"
describe('loading a extension sucesfully', function () {
    // this.timeout(5000);
    let tr: ttm.MockTestRunner;
    beforeEach(() => {
        let tp = path.join(dirname, 'success.js');
        tr = new ttm.MockTestRunner(tp); 
    });

    it("should run successfully", {timeout:5000}, async() => {
        await tr.runAsync();
        const stderr = tr.stderr;
        assert.match(stderr, /WARNING: Replacing existing mock for module/)
    });
});

