import { readFileSync } from "node:fs"

const getCombos = (springs: string[]) => {
  const combos: string[][] = []

  const index = springs.findIndex((s) => s === "?")
  if (index !== -1) {
    const pre = springs.slice(0, index)
    const post = springs.slice(index + 1)
    getCombos(post).forEach((o) => {
      combos.push([...pre, ".", ...o])
      combos.push([...pre, "#", ...o])
      return combos
    })
  } else {
    combos.push(springs)
  }

  return combos
}


const first = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const [springs, damaged] = line.split(" ")
    const regex = new RegExp(
      `^\\.*${damaged
        .split(",")
        .map((c) => `#{${c}}`)
        .join(`\\.+`)}\\.*$`
    )

    const combos = getCombos(springs.split(""))
    combos.forEach((c) => {
      if (regex.test(c.join(""))) {
        sum++
      }
    })
    return sum
  }, 0)
}

const second = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const [springs, damaged] = line.split(" ")
    const regex = new RegExp(
      `^\\.*${damaged
        .split(",")
        .map((c) => `#{${c}}`)
        .join(`\\.+`)}\\.*$`
    )

    const combos = getCombos(springs.split(""))
    const possibleCombos = combos.filter((c) => regex.test(c.join("")))
    console.log(possibleCombos.length)

    return sum + possibleCombos.length
  }, 0)
}

const input = readFileSync("src/12/input.txt", "utf8")

// console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
