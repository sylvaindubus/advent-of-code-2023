import { readFileSync } from "node:fs"

type Universe = string[][]

type Point = [number, number]

const parse = (input: string) => {
  return input.split("\n").reduce<Universe>((universe, row) => [...universe, row.split("")], [])
}

const expandUniverse = (universe: Universe) => {
  return universe.reduce<Universe>((universe, row) => {
    const newUniverse = [...universe]
    if (!row.includes("#")) {
      newUniverse.push(new Array(row.length).fill("."))
    }
    newUniverse.push(row)
    return newUniverse
  }, [])
}

const rotateUniverse = (universe: Universe) => {
  return universe[0].map((_, colIndex) => universe.map((row) => row[colIndex]))
}

const countBetween = (array: number[], a: number, b: number) => array.filter((i) => (i > a && i < b) || (i > b && i < a)).length

const first = (input: string) => {
  let universe = parse(input)

  universe = expandUniverse(universe)
  universe = rotateUniverse(universe)
  universe = expandUniverse(universe)
  universe = rotateUniverse(universe)

  const galaxies = universe.reduce<Point[]>((points, row, x) => {
    row.forEach((cell, y) => {
      if (cell === "#") {
        points.push([x, y])
      }
    })
    return points
  }, [])

  let sum = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [x1, y1] = galaxies[i]
      const [x2, y2] = galaxies[j]
      sum += Math.abs(x1 - x2) + Math.abs(y1 - y2)
    }
  }
  return sum
}

const second = (input: string) => {
  const universe = parse(input)
  const extension = 1000000

  const galaxies = universe.reduce<Point[]>((points, row, x) => {
    row.forEach((cell, y) => {
      if (cell === "#") {
        points.push([x, y])
      }
    })
    return points
  }, [])

  const emptyRows = universe.map((row, index) => (row.includes("#") ? -1 : index)).filter((index) => index !== -1)
  const emptyCols = rotateUniverse(universe)
    .map((row, i) => (row.includes("#") ? -1 : i))
    .filter((index) => index !== -1)

  const calculateDistance = (g1: Point, g2: Point) => {
    const [x1, y1] = g1
    const [x2, y2] = g2
    const xDist = Math.abs(x1 - x2)
    const yDist = Math.abs(y1 - y2)
    const xEmptiness = Math.max(0, countBetween(emptyRows, x1, x2) * (extension - 1))
    const yEmptiness = Math.max(0, countBetween(emptyCols, y1, y2) * (extension - 1))
    return xDist + yDist + xEmptiness + yEmptiness
  }

  let sum = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += calculateDistance(galaxies[i], galaxies[j])
    }
  }
  return sum
}

const input = readFileSync("src/11/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
