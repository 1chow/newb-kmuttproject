var assert = require('assert')
var firstMocha = require('../src/firstMocha.js')


describe('maybeFirst', () => {
    it('returns the first element of an array', () => {
        let result = firstMocha.maybeFirst([1])
        assert.equal(result, 1, 'maybeFirst([1, 2, 3]) is 1')
    })
})

describe('calculateMinus', () => {
    it('return result', () => {
        let result = firstMocha.calculateMinus(8,4)
        assert.equal(result, 4, 'calculateMinus(8, 4) is 4' )
    })
})
