"use strict"

const BN = require(`bignumber.js`).BigNumber

export const coinsToObject = function(coinArray) {
  return (
    coinArray &&
    coinArray.reduce(
      (dictionary, { denom, amount }) => ({
        ...dictionary,
        [denom]: Number(amount) || 0
      }),
      {}
    )
  )
}

// could be used in optimistic update PR, pls uncomment or delete when addressed
export const calculateShares = function(validator, tokens) {
  const myTokens = new BN(tokens || 0)

  const totalShares = new BN(validator.delegator_shares)
  const totalTokens = new BN(validator.tokens)

  if (totalTokens.eq(0)) return new BN(0)
  return myTokens.times(totalShares).div(totalTokens)
}

export const calculateTokens = function(validator, shares) {
  // this is the based on the idea that tokens should equal
  // (myShares / totalShares) * totalTokens where totalShares
  // and totalTokens are both represented as fractions
  const myShares = new BN(shares || 0)
  const totalShares = new BN(validator.delegator_shares)
  const totalTokens = new BN(validator.tokens)

  if (totalShares.eq(0)) return new BN(0)
  return myShares.times(totalTokens).div(totalShares)
}

export const sleep = function(amount) {
  return new Promise(resolve => {
    setTimeout(resolve, amount)
  })
}

export function toMicroDenom(denom) {
  const lookup = {
    ATOM: "uatom",
    MUON: "umuon",
    LUNA: "uluna",
    TREE: "seed",
    NGM: "ungm"
  }
  return lookup[denom] ? lookup[denom] : denom.toLowerCase()
}
