
class SudokuParser {
    stringToSudoku(string) {
        let sudoku = Array(9).fill(Array(9));
        for (let i = 0; i <= 8; i++) {
            const rowIdx = i * 9;
            sudoku[i] = Array.from(string.substring(rowIdx, rowIdx + 9));
        }
        return sudoku;
    }

    sudokuToString(sudoku) {
        return sudoku.map((row) => row.join('')).join('');
    }
}

module.exports = SudokuParser;
