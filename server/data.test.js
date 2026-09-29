import test from 'node:test'
import assert from 'node:assert/strict'
import {createStore, transfer} from './data.js'
test('transfer moves exact kopecks and records an operation', () => {
  const store = createStore()
  const result = transfer(store, {fromId:'main', toId:'savings', amount: 100.25})
  assert.equal(result.accounts[0].balance, 142480.25)
  assert.equal(result.accounts[1].balance, 386520.25)
  assert.equal(result.transactions[0].amount, -100.25)
})
test('transfer rejects insufficient funds and invalid amounts without changes', () => {
  const store = createStore()
  const initial = structuredClone(store.accounts)
  assert.equal(transfer(store, {fromId:'main', toId:'savings', amount: 999999}).status, 400)
  assert.equal(transfer(store, {fromId:'main', toId:'savings', amount: -5}).status, 400)
  assert.equal(transfer(store, {fromId:'main', toId:'savings', amount: 1.001}).status, 400)
  assert.deepEqual(store.accounts, initial)
})
