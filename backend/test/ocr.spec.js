// @flow

process.env.NODE_ENV = 'test';

const { convertCognitiveServicesResponse, extractCast } = require('../services/ocr');
const chai = require('chai');
const fs = require('fs');

chai.should();

describe('OCR', () => {
    fs.readdirSync('./test/resources/')
        .filter(fn => fn.substr(-1 * ('.cast.json'.length)) === '.cast.json')
        .map(fn => `./test/resources/${fn}`)
        .map(fn => {
            const inputFn = fn.replace(/\.cast/, '');
            const input = JSON.parse(fs.readFileSync(inputFn, 'utf8'));
            const expected = JSON.parse(fs.readFileSync(fn, 'utf8'));

            it(`correctly reads the cast for ${inputFn}`, () => {
                // TODO FIXME Inject some wrong names.
                const mapping = expected
                    .reduce((acc, entry) => {
                        const bucket = acc.filter(x => x.role === entry.role);
                        if (bucket.length === 0) {
                            acc.push({ role: entry.role, persons: [{ name: entry.name }] });
                        } else {
                            bucket[0].persons.push({ name: entry.name });
                        }

                        return acc;
                    }, []);

                const converted = convertCognitiveServicesResponse(input);
                const actual = extractCast(converted, mapping);

                // TODO FIXME assert
            });
        });
});