const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js';

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('POST /api/solve', () => {

        test('Solve a puzzle with valid puzzle string', function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string', function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters', function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '1G5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length', function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });

    });

    suite('POST /api/check', () => {

        test('Check a puzzle placement with all fields', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][1],
                    coordinate: 'A1',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['column']);
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '8'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column']);
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][1],
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1G5762984946381257728459613694517832812936745357824196473298561581673429269145378',
                    coordinate: 'A1',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1',
                    coordinate: 'A1',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'J1',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value', function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzlesAndSolutions[0][0],
                    coordinate: 'A1',
                    value: '0'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });

    });
});

