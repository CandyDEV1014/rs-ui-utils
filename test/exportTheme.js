const { describe, it } = require('mocha');
const { expect } = require('chai');
const exportTheme = require('../src/exportTheme');
const ktm350Input = require('./mocks/ktm_350_input.json');
const ktm350Output = require('./mocks/ktm_350_output.json');

describe('Theme export', () =>
    describe('#exportTheme()', () =>
        it('Should export the theme correctly', () => {
            const themeName = 'Test Theme';
            const { theme: actual } = exportTheme(ktm350Input, themeName);

            expect(actual).to.deep.equal(ktm350Output);
        })
    )
);
