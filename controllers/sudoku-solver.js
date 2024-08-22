const SudokuParser = require('../controllers/sudoku-parser.js')
const parser = new SudokuParser();

const rowLookup = {
    "A": 0, "B": 1, "C": 2,
    "D": 3, "E": 4, "F": 5,
    "G": 6, "H": 7, "I": 8,
    "a": 0, "b": 1, "c": 2,
    "d": 3, "e": 4, "f": 5,
    "g": 6, "h": 7, "i": 8
}

const colLookup = (col) => col - 1;

const cellIdxMapFromNums = (row, col) => {
    return {
        rowIdx: row,
        colIdx: col
    };
}
const cellIdxMapFromLetter = (row, col) => {
    return {
        rowIdx: rowLookup[row],
        colIdx: colLookup(col)
    };
}
const rowArr = (sudoku, cell) => sudoku[cell.rowIdx];
const colArr = (sudoku, cell) => sudoku.map((row) => row[cell.colIdx]);
const regionArr = (sudoku, cell) => {
    let result = [];
    const squRowIdx = cell.rowIdx - cell.rowIdx % 3;
    const squColIdx = cell.colIdx - cell.colIdx % 3;
    for (let rowIdx = squRowIdx; rowIdx <= squRowIdx + 2; rowIdx++) {
        for (let colIdx = squColIdx; colIdx <= squColIdx + 2; colIdx++) {
            result.push(sudoku[rowIdx][colIdx]);
        }
    }
    return result;
}

function findEmptyCell(sudoku, cell) {
    for (let rowIdx = 0; rowIdx <= 8; rowIdx++) {
        for (let colIdx = 0; colIdx <= 8; colIdx++) {
            if (sudoku[rowIdx][colIdx] == '.') {
                return cellIdxMapFromNums(rowIdx, colIdx);
            }
        }
    }
    return false;
}

function invalidValue(sudoku, cell, value) {
    if (rowArr(sudoku, cell).includes(value)
        || colArr(sudoku, cell).includes(value)
        || regionArr(sudoku, cell).includes(value)) {
        return true;
    }

    return false;
}
function solveSudoku(sudoku, cell = { rowIdx: 0, colIdx: 0 }) {
    let emptyCell = findEmptyCell(sudoku, cell);
    if (!emptyCell) {
        return sudoku;
    }

    cell = emptyCell;
    const row = cell.rowIdx;
    const col = cell.colIdx;

    for (let num = 1; num <= 9; num++) {
        num = String(num);
        if (invalidValue(sudoku, cell, num)) {
            continue;
        }
        sudoku[row][col] = num;
        let solution = solveSudoku(sudoku, cell);
        if (solution) {
            return solution;
        }
        sudoku[row][col] = '.';
    }

    return false;
}

class SudokuSolver {

    validate(puzzleString) {
        if (!puzzleString) {
            throw 'Required field missing';
        }
        if (puzzleString.length !== 81) {
            throw 'Expected puzzle to be 81 characters long';
        }
        const sudoku = parser.stringToSudoku(puzzleString);

        for (let rowIdx = 0; rowIdx <= 8; rowIdx++) {
            for (let colIdx = 0; colIdx <= 8; colIdx++) {
                const value = sudoku[rowIdx][colIdx];
                if (value == ".") {
                    continue;
                }
                if (isNaN(value)) {
                    throw 'Invalid characters in puzzle';
                }
                const cell = cellIdxMapFromNums(rowIdx, colIdx);
                let sudokuWithoutCurr = structuredClone(sudoku);
                sudokuWithoutCurr[rowIdx][colIdx] = ".";

                // Row, column and region validation
                if (invalidValue(sudokuWithoutCurr, cell, value)) {
                    throw 'Puzzle cannot be solved';
                }
            }
        }

        return true;
    }

    checkRowPlacement(sudoku, row, col, value) {
        const arr = rowArr(parser.stringToSudoku(sudoku), cellIdxMapFromLetter(row, col));
        arr.splice(colLookup(col), 1);
        return !arr.includes(value);
    }

    checkColPlacement(sudoku, row, col, value) {
        const arr = colArr(parser.stringToSudoku(sudoku), cellIdxMapFromLetter(row, col));
        arr.splice(rowLookup[row], 1);
        return !arr.includes(value);
    }

    checkRegionPlacement(sudoku, row, col, value) {
        const arr = regionArr(parser.stringToSudoku(sudoku), cellIdxMapFromLetter(row, col));
        arr.splice((rowLookup[row] % 3) * 3 + colLookup(col) % 3, 1);
        return !arr.includes(value);
    }

    solve(sudoku) {
        return solveSudoku(sudoku);
    }
}

module.exports = SudokuSolver;

