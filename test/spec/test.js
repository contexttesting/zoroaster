const assert = require('assert');
const Test = require('../../src/test');

const name = 'The higher we soar the smaller we appear to those who cannot fly.';
const fn = () => {};
const errorMessage = 'When you are in doubt abstain.';


const Test_test_suite = {
    'should create a new Test instance': () => {
        const test = new Test(name, fn);

        assert(test instanceof Test);
        assert(test.name === name);
        assert(test.fn === fn);
        assert(test.started === null);
        assert(test.finished === null);
        assert(test.error === null);
        assert(test.result === null);
        assert(typeof test.run === 'function');
    },
    'should run a test': () => {
        const test = new Test(name, fn);
        const res = test.run();

        assert(res instanceof Promise);
        assert(test.started !== null);
        return res.then(() => {
            assert(test.error === null);
            assert(test.result === undefined);
            assert(test.finished !== null);
        });
    },
    'should save result of a test': () => {
        const result = 'test_string_result';
        const test = new Test(name, () => result);
        const res = test.run();

        return res.then(() => {
            assert(test.result === result);
        });
    },
    'should run a test with an error': () => {
        const test = new Test(name, () => {
            throw new Error(errorMessage);
        });
        const res = test.run();

        return res.then(() => {
            assert(test.result === null);
            assert(test.error !== null);
            assert(test.error.message === errorMessage);
            assert(test.result === null);
        });
    },
    'should report as having an error': () => {
        const test = new Test(name, () => {
            throw new Error(errorMessage);
        });
        return test.run()
            .then(() => {
                assert(test.hasErrors());
            });
    },
    'should report as not having an error': () => {
        const test = new Test(name, () => {});
        return test.run()
            .then(() => {
                assert(!test.hasErrors());
            });
    },
};

module.exports = Test_test_suite;
