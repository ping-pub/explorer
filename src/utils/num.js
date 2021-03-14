"use strict"
import BigNumber from "bignumber.js"

/**
 * Defines all numerical methods
 * @module num
 */

// truncate decimals to not round when using Intl.NumberFormat
function truncate(number, digits) {
  return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits)
}

export const SMALLEST = 1e-6
const language = window.navigator.userLanguage || window.navigator.language

function setDecimalLength(value, length) {
  if (value === undefined || value === null || Number.isNaN(value)) return null

  // rounding up the last decimal
  const roundedValue =
    Math.round(value * Math.pow(10, length)) / Math.pow(10, length)

  return new Intl.NumberFormat(language, {
    minimumFractionDigits: length > 3 ? length : 0
  }).format(truncate(roundedValue, length))
}
export function twoDecimals(value) {
  return Number(setDecimalLength(value, 2))
}
export function shortDecimals(value) {
  return setDecimalLength(value, 3)
}

export function fullDecimals(value) {
  return setDecimalLength(value, 6)
}

export function pretty(number = 0) {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.round(number * 100) / 100)
}

export function prettyLong(number = 0) {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: 20,
    useGrouping: true
  }).format(number)
}

// pretty print long decimals not in scientific notation
export function prettyDecimals(number = 0) {
  let longDecimals = new Intl.NumberFormat(language, {
    minimumFractionDigits: 20,
    maximumFractionDigits: 20
  }).format(number)

  // remove all trailing zeros
  while (longDecimals.charAt(longDecimals.length - 1) === `0`) {
    longDecimals = longDecimals.substr(0, longDecimals.length - 1)
  }

  // remove decimal separator from whole numbers
  if (Number.isNaN(Number(longDecimals.charAt(longDecimals.length - 1)))) {
    longDecimals = longDecimals.substr(0, longDecimals.length - 1)
  }

  return longDecimals
}

export function prettyInt(number = 0) {
  return new Intl.NumberFormat(language).format(Math.round(number))
}

export function percentInt(number = 0) {
  return new Intl.NumberFormat(language).format(Math.round(number * 100)) + `%`
}

export function percent(number = 0) {
  return (
    parseFloat(new Intl.NumberFormat(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.round(number * 10000) / 100)) + `%`
  )
}

export function bigFigure(number = 0) {
  let formatted = Math.round(number * 100) / 100

  let suffix = ""
  if (Math.abs(Number(formatted)) >= 1e12) {
    formatted = Number(formatted) / 1e12
    suffix = "T"
  } else if (Math.abs(Number(formatted)) >= 1e9) {
    formatted = Number(formatted) / 1e9
    suffix = "B"
  } else if (Math.abs(Number(formatted)) >= 1e6) {
    formatted = Number(formatted) / 1e6
    suffix = "M"
  }
  return (
    new Intl.NumberFormat(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(formatted) + ` ${suffix}`
  )
}

export function bigFigureOrShortDecimals(number) {
  // here we check how many positive digits the number has to see how we should format it
  if (Math.abs(Number(number)) < 1e6) {
    return shortDecimals(number)
  } else {
    return bigFigure(number)
  }
}

export function bigFigureOrPercent(number) {
  // once again, the same logic
  if (Math.abs(Number(number)) < 1e4) {
    return percent(number)
  } else {
    return bigFigure(number * 100)
      .toString()
      .concat(` %`)
  }
}

export function atoms(number = 0) {
  return BigNumber(number)
    .div(1e6)
    .toNumber()
}

export function toIris(number = 0) {
  return BigNumber(number)
    .div(1e18)
    .toNumber()
}

export function uatoms(number = 0) {
  return (
    BigNumber(number)
      .times(1e6)
      // .toFixed(0) // Temporary here. Waiting for Aleksei/fee in extension #3567 to be merged
      .toString()
  )
}


// convert micro denoms like uatom to display denoms like ATOM
export function viewDenom(denom) {
  if (denom.charAt(0) === `u`) {
    return denom.substr(1).toUpperCase()
  }
  return denom.toUpperCase()
}

export function createDisplayCoin({ amount, denom }, length = 3) {
  return {
    amount: amount && setDecimalLength(atoms(amount), length),
    denom: viewDenom(denom)
  }
}

// This will take an object and for each (k,v) will return
// v rounded such that the sum of all v is 100.
// Used the following as a reference:
// https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
// Note: We pass an object, and want to keep the (key, value) association.
export const roundObjectPercentages = dataMap => {
  // This algorithm workson integers and we want 2 decimal places.
  // So round up first.
  const scale = 100
  let asArray = Object.entries(dataMap).map(([key, value]) => {
    return [key, value * scale]
  })

  const sumRounded = (acc, x) => {
    return acc + Math.round(x[1])
  }

  // The leftOver is the difference beween 100 and
  // the sum of the rounded values.
  var leftOver = scale * 100 - asArray.reduce(sumRounded, 0)

  //
  const cmpNumberValue = (a, b) => {
    return b[1] - Math.round(a[1]) - a[1]
  }

  // Here we distribute the leftOver as evenly as possible amongst the rounded values.
  // The values are sorted first.
  asArray.sort(cmpNumberValue)
  const result = asArray.map(function(x, i) {
    // Note: leftOver can be negative.
    const rounded = [
      x[0],
      (Math.round(x[1]) + (leftOver > i) - (i >= asArray.length + leftOver)) /
        100.0
    ]
    return rounded
  })

  // Turn the array back into the original data structure layout
  const resultObject = {}
  result.forEach(x => {
    resultObject[x[0]] = x[1]
  })

  return resultObject
}

export default {
  SMALLEST,
  atoms,
  uatoms,
  viewDenom,
  createDisplayCoin,
  shortDecimals,
  fullDecimals,
  pretty,
  prettyInt,
  prettyLong,
  percent,
  percentInt,
  prettyDecimals,
  roundObjectPercentages,
  bigFigure,
  bigFigureOrShortDecimals,
  bigFigureOrPercent
}
