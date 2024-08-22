'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const SudokuParser = require('../controllers/sudoku-parser.js')

module.exports = function (app) {

    const parser = new SudokuParser();
    const solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
            const puzzle = req.body.puzzle;
            const coordinate = req.body.coordinate;
            const value = req.body.value;
            const row = coordinate.charAt(0);
            const column = Number(coordinate.charAt(1));

            try {
                if (!puzzle || !coordinate || !value) {
                    throw 'Required field(s) missing';
                }
                if (puzzle.length !== 81) {
                    throw 'Expected puzzle to be 81 characters long';
                }
                if (coordinate.length > 2 || column < 1 || column > 9 ||
                    !['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].includes(row.toLowerCase())
                ) {
                    throw 'Invalid coordinate';
                }
                const valueAsNumber = Number(value);
                if (valueAsNumber < 1 || valueAsNumber > 9) {
                    throw 'Invalid value';
                }
                for (let i = 0; i <= 80; i++) {
                    const value = puzzle[i];
                    if (value == ".") {
                        continue;
                    }
                    if (isNaN(value)) {
                        throw 'Invalid characters in puzzle';
                    }
                }
            } catch (error) {
                return res.json({ error: error });
            }

            const validRowPlacement = solver.checkRowPlacement(puzzle, row, column, value);
            const validColPlacement = solver.checkColPlacement(puzzle, row, column, value);
            const validRegionPlacement = solver.checkRegionPlacement(puzzle, row, column, value);

            if (validRowPlacement && validColPlacement && validRegionPlacement) {
                return res.json({ valid: true })
            } else {
                let conflict = [];
                if (!validRowPlacement) {
                    conflict.push('row')
                }
                if (!validColPlacement) {
                    conflict.push('column')
                }
                if (!validRegionPlacement) {
                    conflict.push('region')
                }
                return res.json({ valid: false, conflict })
            }
        });

    app.route('/api/solve')
        .post((req, res) => {
            const puzzle = req.body.puzzle;
            try {
                solver.validate(puzzle);
                const solution = solver.solve(parser.stringToSudoku(puzzle));
                if (!solution) {
                    throw 'Puzzle cannot be solved';
                }
                return res.json({ solution: parser.sudokuToString(solution) });
            } catch (error) {
                return res.json({ error });
            }
        });
};
