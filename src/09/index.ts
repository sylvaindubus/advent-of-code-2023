import { readFileSync } from "node:fs"

const computeSequences = (sequences: number[][]) => {
  const sequence = sequences.at(-1)!
  if (sequence.find((v) => v !== 0)) {
    const nextSequence = sequence.reduce<number[]>((acc, curr, index) => {
      if (index === 0) return acc
      acc.push(curr - sequence[index - 1])
      return acc
    }, [])
    sequences.push(nextSequence)
    computeSequences(sequences)
  } else {
    return sequences
  }
  return sequences
}

const calculateNextValue = (sequences: number[][]) => {
  const remainingSequences = [...sequences]
  const lastSequence = remainingSequences.pop()
  if (!lastSequence || !lastSequence.length) {
    throw new Error("Bad arguments")
  }

  const secondLastSequence = remainingSequences.at(-1)
  if (!secondLastSequence || !secondLastSequence.length) {
    return lastSequence!.at(-1)
  }

  const value = secondLastSequence.at(-1)! + lastSequence.at(-1)!
  remainingSequences.at(-1)!.push(value)
  return calculateNextValue(remainingSequences)
}

const calculatePrevValue = (sequences: number[][]) => {
  const remainingSequences = [...sequences]
  const lastSequence = remainingSequences.pop()
  if (!lastSequence || !lastSequence.length) {
    throw new Error("Bad arguments")
  }

  const secondLastSequence = remainingSequences.at(-1)
  if (!secondLastSequence || !secondLastSequence.length) {
    return lastSequence!.at(0)
  }

  const value = secondLastSequence.at(0)! - lastSequence.at(0)!
  remainingSequences.at(-1)!.unshift(value)
  return calculatePrevValue(remainingSequences)
}

const first = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const values = line.split(" ").map(Number)
    const sequences = computeSequences([values])
    const nextValue = calculateNextValue(sequences)
    return sum + nextValue
  }, 0)
}

const second = (input: string) => {
  return input.split("\n").reduce((sum, line) => {
    const values = line.split(" ").map(Number)
    const sequences = computeSequences([values])
    const prevValue = calculatePrevValue(sequences)
    return sum + prevValue
  }, 0)
}

const input = readFileSync("src/09/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
