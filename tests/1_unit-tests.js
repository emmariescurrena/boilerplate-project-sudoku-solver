const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const SudokuSolver = require('../controllers/sudoku-solver.js');
const SudokuParser = require('../controllers/sudoku-parser.js')
import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js';

const parser = new SudokuParser();
const solver = new SudokuSolver();


suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
        assert.isTrue(solver.validate(puzzlesAndSolutions[0][0]));
        done();
    });

    test(
        'Logic handles a puzzle string with invalid characters (not 1-9 or .)',
        (done) => {
            expect(() => solver.validate(
                '1G5762984946381257728459613694517832812936745357824196473298561581673429269145378'
            )).to.throw('Invalid characters in puzzle');
            assert.isTrue(true);
            done();
        });

    test(
        'Logic handles a puzzle string that is not 81 characters in length',
        (done) => {
            expect(() => solver.validate(
                '13576298494638125772845961369451783281293674535782419647329856158167342926914537'
            )).to.throw('Expected puzzle to be 81 characters long');
            assert.isTrue(true);
            done();
        });

    test('Logic handles a valid row placement', (done) => {
        assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][1], 'a', 1, '1'));
        done();
    });


    test('Logic handles an invalid row placement', (done) => {
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][1], 'a', 1, '5'));
        done();
    });

    test('Logic handles a valid column placement', (done) => {
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][1], 'a', 2, '3'));
        done();
    });

    test('Logic handles an invalid column placement', (done) => {
        assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][1], 'a', 9, '8'));
        done();
    });


    test('Logic handles a valid region (3x3 grid) placement', (done) => {
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][1], 'a', 1, '1'));
        done();
    });

    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][1], 'a', 1, '5'));
        done();
    });


    test('Valid puzzle strings pass the solver', (done) => {
        let solution = solver.solve(parser.stringToSudoku(puzzlesAndSolutions[0][0]));
        assert.isNotFalse(solution);
        done();
    });

    test('Invalid puzzle strings pass the solver', (done) => {
        assert.isFalse(solver.solve(parser.stringToSudoku('115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')));
        done();
    });

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
        let solution = solver.solve(parser.stringToSudoku(puzzlesAndSolutions[0][0]));
        assert.equal(parser.sudokuToString(solution), puzzlesAndSolutions[0][1]);
        done();
    });


});
