import { readFileSync } from "node:fs"

const input = readFileSync("src/05/input.txt", "utf8")

const spaceRegex = /\s+/

type Conversions = number[][][]

const parseSeeds = (input: string) => {
  let seeds: number[] = []
  input.split("\n").find((line) => {
    const matchSeeds = /^seeds: ([\d+\s]+)/.exec(line)
    if (matchSeeds && matchSeeds[1]) {
      seeds = matchSeeds[1].split(" ").map(Number)
      return true
    }
    return false
  })
  return seeds
}

const parseSeedRanges = (input: string) => {
  let seedRanges: number[][] = []

  const seeds = parseSeeds(input)
  while (seeds.length) {
    const start = seeds.shift()!
    const length = seeds.shift()!
    seedRanges.push([start, start + length - 1])
  }

  return seedRanges
}

const parseConversions = (input: string) => {
  let conv: Conversions = []
  input.split("\n").forEach((line) => {
    const matchLabel = /^(\w+\-to\-\w+) map:/.exec(line)
    if (matchLabel && matchLabel[1]) {
      conv.push([])
      return
    }
    const matchValues = /^([\d+\s]+)/.exec(line)
    if (matchValues && matchValues[1]) {
      const [_, values] = matchValues
      conv[conv.length - 1].push(values.split(spaceRegex).map(Number))
      return
    }
  })

  return conv.map((values) =>
    values.sort(([_, a], [_2, b]) => {
      if (a < b) return -1
      if (b > a) return 1
      return 0
    })
  )
}

const getLocation = (map: Conversions, seed: number) => {
  let lastValue = seed
  map.forEach((category) => {
    category.some(([dest, source, length]) => {
      if (lastValue >= source && lastValue < source + length) {
        lastValue = dest + (lastValue - source)
        return true
      }
    })
  })
  return lastValue
}

const isBetween = (value: number, min: number, max: number) => value >= min && value <= max

const getNextRange = (conversions: Conversions, range: number[]) => {
  const [conversion, ...otherConversions] = conversions

  let [A, B] = range

  console.log("A", A, "B", B)
  console.log("conversion", conversion)

  const newRanges: number[][] = []
  conversion.forEach(([dest, C, length]) => {
    const D = C + length - 1
    const diff = dest - C
    if (B < C) {
      console.log("case 1")
      return
    }
    if (A > D) {
      console.log("case 2")
      return
    }
    if (isBetween(A, C, D) && isBetween(B, C, D)) {
      console.log("case 3")
      newRanges.push([A + diff, B + diff])
      A = 0
      B = 0
      return
    }
    if (isBetween(C, A, B) && isBetween(D, A, B)) {
      console.log("case 4")
      console.log(A, B)
      newRanges.push([A, C])
      newRanges.push([C + diff, D + diff])
      newRanges.push([C, B])
      A = D + 1
      return
    }
    if (isBetween(A, C, D) && B > D) {
      console.log("case 5")
      newRanges.push([A + diff, D + diff])
      A = D + 1
      return
    }
    if (isBetween(B, C, D) && A < C) {
      console.log("case 6")
      newRanges.push([A, C])
      newRanges.push([C + diff, B + diff])
      A = 0
      B = 0
      return
    }
  })

  if (A && B) {
    newRanges.push([A, B])
  }

  console.log("newRanges", newRanges)
  if (otherConversions.length > 0) {
    return newRanges.map((r) => getNextRange(otherConversions, r))
  }
  return newRanges
}

const flatten = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(flatten)
  }
  return value
}

const first = (input: string) => {
  const seeds = parseSeeds(input)
  const conversions = parseConversions(input)

  const locations = seeds.map((seed) => getLocation(conversions, seed))
  return Math.min(...locations)
}

const second = (input: string) => {
  const seedRanges = parseSeedRanges(input)
  const conversions = parseConversions(input)

  const locations = seedRanges.map((seedRange) => getNextRange(conversions, seedRange))
  return Math.min(...locations.flat(Infinity))
}

// const bruteforceSecond = (input: string) => {
//   const seedRanges = parseSeedRanges(input)
//   const conversions = parseConversions(input)

//   let min = Infinity
//   seedRanges.forEach(([start, end]) => {
//     for (let i = start; i < end; i++) {
//       const location = getLocation(conversions, i)
//       min = Math.min(min, location)
//     }
//   })

//   return min
// }

console.log("🎅 firstResult", first(input))
console.log("🎅 firstResult", second(input))
// console.log("🎅 secondResult", bruteforceSecond(input)) // answer is 79874951
