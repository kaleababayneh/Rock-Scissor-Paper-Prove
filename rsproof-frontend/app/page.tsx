"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Choice = "rock" | "paper" | "scissors"
type GameResult = "win" | "lose" | "draw" | null

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<GameResult>(null)
  const [userScore, setUserScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [gameHistory, setGameHistory] = useState<Array<{ user: Choice; computer: Choice; result: GameResult }>>([])

  const choices: Choice[] = ["rock", "paper", "scissors"]

  const emojis = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️",
  }

  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3)
    return choices[randomIndex]
  }

  const determineWinner = (user: Choice, computer: Choice): GameResult => {
    if (user === computer) return "draw"

    if (
      (user === "rock" && computer === "scissors") ||
      (user === "paper" && computer === "rock") ||
      (user === "scissors" && computer === "paper")
    ) {
      return "win"
    }

    return "lose"
  }

  const handleChoice = (choice: Choice) => {

    if (result !== null) return
    
    const computer = getComputerChoice()
    setUserChoice(choice)
    setComputerChoice(computer)

    const gameResult = determineWinner(choice, computer)
    setResult(gameResult)

    if (gameResult === "win") {
      setUserScore((prev) => prev + 1)
    } else if (gameResult === "lose") {
      setComputerScore((prev) => prev + 1)
    }

    setGameHistory((prev) => [...prev, { user: choice, computer, result: gameResult }])
  }

  const resetGame = () => {
    setUserChoice(null)
    setComputerChoice(null)
    setResult(null)
  }

  const getResultMessage = () => {
    if (result === "win") return "You win!"
    if (result === "lose") return "Computer wins!"
    if (result === "draw") return "It's a draw!"
    return "Make your choice!"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center my-8">Rock Paper Scissors</h1>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        <Card className="flex-1 p-6 flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Choose your move</h2>
            <div className="flex justify-center gap-4">
              {choices.map((choice) => (
                <Button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  className="text-3xl h-16 w-16 rounded-full"
                  variant={userChoice === choice ? "default" : "outline"}
                  disabled={result !== null}
                >
                  {emojis[choice]}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-12 my-8">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">You</p>
              <div className="text-6xl h-24 w-24 flex items-center justify-center bg-gray-100 rounded-lg">
                {userChoice ? emojis[userChoice] : "?"}
              </div>
            </div>

            <div className="text-xl font-bold">VS</div>

            <div className="text-center">
              <p className="text-sm font-medium mb-2">Computer</p>
              <div className="text-6xl h-24 w-24 flex items-center justify-center bg-gray-100 rounded-lg">
                {computerChoice ? emojis[computerChoice] : "?"}
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-xl font-bold mb-4">{getResultMessage()}</p>
            {result && (
              <Button onClick={resetGame} variant="outline">
                Play Again
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Score Board</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">You</TableHead>
                <TableHead className="text-center">Computer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-3xl">{userScore}</TableCell>
                <TableCell className="text-center text-3xl">{computerScore}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-medium mt-8 mb-4">Game History</h3>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>You</TableHead>
                  <TableHead>Computer</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No games played yet
                    </TableCell>
                  </TableRow>
                ) : (
                  gameHistory.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell>{emojis[game.user]}</TableCell>
                      <TableCell>{emojis[game.computer]}</TableCell>
                      <TableCell>{game.result === "win" ? "Win" : game.result === "lose" ? "Loss" : "Draw"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}

