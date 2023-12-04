import { readFileSync } from "node:fs"

const limits = {
  red: 12,
  green: 13,
  blue: 14,
}

const first = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const labelRegex = /^Game (\d+):/
    const res = labelRegex.exec(line)
    if (!res) return sum
    const [label, id] = res
    const isPossible = line
      .replace(label, "")
      .split(";")
      .every((set) => {
        let match: RegExpExecArray | null
        const colorRegex = /(\d+) (green|red|blue)/g
        while ((match = colorRegex.exec(set))) {
          const [_, quantity, color] = match
          if (limits[color] && Number(quantity) > limits[color]) return false
        }
        return true
      })
    if (!isPossible) return sum
    return sum + Number(id)
  }, 0)
}

const second = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const max = { red: 0, green: 0, blue: 0 }
    let match: RegExpExecArray | null
    const colorRegex = /(\d+) (green|red|blue)/g
    while ((match = colorRegex.exec(line))) {
      const [_, quantity, color] = match
      if (quantity > max[color]) {
        max[color] = Number(quantity)
      }
    }
    const power = Object.values(max)
      .map(Number)
      .reduce((power, value) => power * value)
    return sum + power
  }, 0)
}

const input = readFileSync("src/02/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
