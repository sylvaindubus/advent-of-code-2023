import { readFileSync } from "node:fs"

const digitNames = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

const first = (input: string) => {
  const regex = /\d/g

  return input.split("\n").reduce((sum, line) => {
    const digits = [...line.matchAll(regex)]
    const [firstRes, lastRes] = [digits.shift(), digits.pop()]
    const firstDigit = firstRes ? Number(firstRes[0]) : 0
    const lastDigit = lastRes ? Number(lastRes[0]) : firstDigit
    const value = Number(`${firstDigit}${lastDigit}`)
    return sum + value
  }, 0)
}

const second = (input: string) => {
  const regex = /(\d)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/
  const reversedRegex = /(\d)|(eno)|(owt)|(eerht)|(ruof)|(evif)|(xis)|(neves)|(thgie)|(enin)/

  const wordToDigit = (word: string): number => {
    if (digitNames[word]) return digitNames[word]
    return Number(word)
  }

  const reverseString = (string: string) => string.split("").reverse().join("")

  return input.split("\n").reduce((sum, line) => {
    const firstRes = line.match(regex)
    const firstDigit = firstRes ? wordToDigit(firstRes[0]) : 0
    const lastRes = reverseString(line).match(reversedRegex)
    const lastDigit = lastRes ? wordToDigit(reverseString(lastRes[0])) : firstDigit
    const value = Number(`${firstDigit}${lastDigit}`)
    return sum + value
  }, 0)
}

const input = readFileSync("src/01/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
