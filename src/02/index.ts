import { readFileSync } from "node:fs"

const limits = {
  red: 12,
  green: 13,
  blue: 14,
}

const first = (input: string) => {
  const labelRegex = /^Game (\d+):/
  const colorRegex = /(\d+) (green|red|blue)/g

  return input.split("\n").reduce((sum, line) => {
    const res = labelRegex.exec(line)
    if (!res) return sum
    const [label, id] = res
    const isPossible = line
      .replace(label, "")
      .split(";")
      .every((set) => {
        let match: RegExpExecArray | null
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

const input = readFileSync("src/02/input.txt", "utf8")

console.log("🎅 firstResult", first(input)) // 2554 is wrong
