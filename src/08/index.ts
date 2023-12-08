import { readFileSync } from "node:fs"

const pathRegex = /^[LR]+$/
const nodeRegex = /^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/

type Network = {
  path: string[]
  nodes: Record<string, string[]>
}

const parse = (input: string) => {
  const network: Network = { path: [], nodes: {} }
  return input.split("\n").reduce((acc, line) => {
    if (pathRegex.test(line)) {
      return {
        ...acc,
        path: line.split(""),
      }
    }
    const matchNode = line.match(nodeRegex)
    if (matchNode) {
      const [_, start, left, right] = matchNode
      return {
        ...acc,
        nodes: {
          ...acc.nodes,
          [start]: [left, right],
        },
      }
    }
    return acc
  }, network)
}

const first = (input: string) => {
  const network = parse(input)

  let place = "AAA"
  let count = 0
  let pathIndex = 0
  do {
    const direction = network.path[pathIndex++]
    if (pathIndex === network.path.length) pathIndex = 0

    if (direction === "L") {
      place = network.nodes[place][0]
    } else if (direction === "R") {
      place = network.nodes[place][1]
    } else {
      return Infinity
    }
    count++
  } while (place !== "ZZZ")
  return count
}

const second = (input: string) => {
  const network = parse(input)
  const counts = Object.keys(network.nodes)
    .filter((p) => p.at(-1) === "A")
    .map((p) => {
      let pathIndex = 0
      let count = 0
      let place = p
      while (place.at(-1) !== "Z") {
        const direction = network.path[pathIndex++]
        if (pathIndex === network.path.length) pathIndex = 0

        if (direction === "L") {
          place = network.nodes[place][0]
        } else if (direction === "R") {
          place = network.nodes[place][1]
        } else {
          return Infinity
        }
        count++
      }
      return count
    })

  const gcd = (a: number, b: number) => (a ? gcd(b % a, a) : b)

  const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

  return counts.reduce(lcm)
}

const input = readFileSync("src/08/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
