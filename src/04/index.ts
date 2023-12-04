import { readFileSync } from "node:fs"

const spaceRegex = /\s+/

const first = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const res = /Card\s+\d+\: ([\d\s]+)+\|([\d\s]+)+/.exec(line)
    if (!res) return sum
    const [_, firstPart, secondPart] = res
    const winningNumbers = firstPart.trim().split(spaceRegex).map(Number)
    const havingNumbers = secondPart.trim().split(spaceRegex).map(Number)
    const points = havingNumbers.reduce((pointsSum, number) => {
      if (!winningNumbers.includes(number)) return pointsSum
      if (pointsSum === 0) return 1
      return pointsSum * 2
    }, 0)
    return sum + points
  }, 0)
}

const second = (input: string) => {
  const lines = input.split("\n")
  const scratchcards = new Array(lines.length).fill(1)

  lines.forEach((line, index) => {
    const res = /Card\s+\d+\: ([\d\s]+)+\|([\d\s]+)+/.exec(line)
    if (!res) return scratchcards
    const [_, firstPart, secondPart] = res
    const winningNumbers = firstPart.trim().split(spaceRegex).map(Number)
    const havingNumbers = secondPart.trim().split(spaceRegex).map(Number)
    const winningCount = havingNumbers.reduce((count, number) => {
      if (!winningNumbers.includes(number)) return count
      return count + 1
    }, 0)
    for (let i = index + 1; i < index + winningCount + 1 && i < lines.length; i++) {
      scratchcards[i] += scratchcards[index]
    }
  })

  return scratchcards.reduce((sum, value) => sum + value)
}

const input = readFileSync("src/04/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
