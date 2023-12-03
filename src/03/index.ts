import { readFileSync } from "node:fs"

type Point = {
  row: number
  col: number
}

const first = (input: string) => {
  const engine = input.split("\n").map((line) => line.split(""))

  const hasSymbolAround = (point: Point, length: number) => {
    for (let row = point.row - 1; row <= point.row + 1; row++) {
      for (let col = point.col - 1; col <= point.col + length; col++) {
        if (engine[row] && engine[row][col] && /[^\d\.]/.test(engine[row][col])) {
          return true
        }
      }
    }
    return false
  }

  return input.split("\n").reduce((sum, line, row) => {
    let lineSum = 0
    let match: RegExpExecArray | null
    const regex = /(\d)+/g
    while ((match = regex.exec(line))) {
      const value = match[0]
      const col = match.index
      if (hasSymbolAround({ row, col }, value.length)) {
        lineSum += Number(value)
      }
    }
    return sum + lineSum
  }, 0)
}

const second = (input: string) => {
  const engine = input.split("\n").map((line) => line.split(""))

  const getWholeNumber = (point: Point) => {
    let number = engine[point.row][point.col]
    let col = point.col - 1
    while (engine[point.row][col] && /(\d)/.test(engine[point.row][col])) {
      number = engine[point.row][col] + number
      col--
    }
    col = point.col + 1
    while (engine[point.row][col] && /(\d)/.test(engine[point.row][col])) {
      number += engine[point.row][col]
      col++
    }
    return Number(number)
  }

  const getNumbersAround = (point: Point) => {
    const res: number[] = []
    for (let row = point.row - 1; row <= point.row + 1; row++) {
      for (let col = point.col - 1; col <= point.col + 1; col++) {
        if (engine[row] && engine[row][col] && /(\d)/.test(engine[row][col])) {
          const number = getWholeNumber({ row, col })
          res.push(number)
          while (engine[row][col + 1] && /(\d)/.test(engine[row][col + 1])) {
            col++
          }
        }
      }
    }

    return res
  }

  return input.split("\n").reduce((sum, line, row) => {
    let lineSum = 0
    let match: RegExpExecArray | null
    const regex = /\*/g
    while ((match = regex.exec(line))) {
      const col = match.index
      const numbersAround = getNumbersAround({ row, col })
      if (numbersAround.length === 2) {
        lineSum += numbersAround[0] * numbersAround[1]
      }
    }
    return sum + lineSum
  }, 0)
}

const input = readFileSync("src/03/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
