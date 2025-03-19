"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Info } from "lucide-react"

type Choice = "rock" | "paper" | "scissors"
type GameResult = "win" | "lose" | "draw" | null

interface GameRecord {
  id: string
  user: Choice
  computer: Choice
  result: GameResult
  timestamp: number
}

interface ProofResponse {
  success: boolean
  proof: string
  verificationCode: string
  timestamp: number
  totalGames: number
  userWins: number
  computerWins: number
  draws: number
  message: string
}

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<GameResult>(null)
  const [userScore, setUserScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([])
  const [proofStatus, setProofStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [proofData, setProofData] = useState<ProofResponse | null>(null)

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
    // Only allow choice if there's no result yet
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

    // Create a detailed game record
    const newGameRecord: GameRecord = {
      id: crypto.randomUUID(),
      user: choice,
      computer,
      result: gameResult,
      timestamp: Date.now(),
    }

    setGameHistory((prev) => [...prev, newGameRecord])

    // Reset proof status when starting a new game
    setProofStatus("idle")
    setProofData(null)
  }

  const resetGame = () => {
    setUserChoice(null)
    setComputerChoice(null)
    setResult(null)
    setProofStatus("idle")
    setProofData(null)
  }

  const getResultMessage = () => {
    if (result === "win") return "You win!"
    if (result === "lose") return "Computer wins!"
    if (result === "draw") return "It's a draw!"
    return "Make your choice!"
  }

  const generateProof = async () => {
    if (!userChoice || !computerChoice || !result || gameHistory.length === 0) return

    try {
      setProofStatus("loading")

      // Get the current game details
      const currentGame = {
        user: userChoice,
        computer: computerChoice,
        result,
      }

      const response = await fetch("/api/generate-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameHistory,
          currentGame,
          timestamp: Date.now(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate proof")
      }

      const data = await response.json()
      setProofData(data)
      setProofStatus("success")
    } catch (error) {
      console.error("Error generating proof:", error)
      setProofStatus("error")
    }
  }

  const resetAll = () => {
    resetGame()
    setUserScore(0)
    setComputerScore(0)
    setGameHistory([])
    setProofStatus("idle")
    setProofData(null)
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={resetGame} variant="outline">
                  Play Again
                </Button>
                <Button
                  onClick={generateProof}
                  disabled={proofStatus === "loading" || proofStatus === "success"}
                  variant="secondary"
                >
                  {proofStatus === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : proofStatus === "success" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Proof Generated
                    </>
                  ) : (
                    "Generate Proof"
                  )}
                </Button>
              </div>
            )}

            {gameHistory.length > 0 && (
              <Button
                onClick={resetAll}
                variant="ghost"
                className="mt-4 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Reset All Games
              </Button>
            )}
          </div>

          {proofStatus === "success" && proofData && (
            <Alert className="mt-4 max-w-md">
              <AlertTitle className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Proof Generated Successfully
              </AlertTitle>
              {/* <AlertDescription>
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Verification Code:</strong> {proofData.verificationCode}
                  </p>
                  <p className="mt-1">
                    <strong>Games Played:</strong> {proofData.totalGames}
                  </p>
                  <p className="mt-1">
                    <strong>Your Wins:</strong> {proofData.userWins}
                  </p>
                  <p className="mt-1">
                    <strong>Computer Wins:</strong> {proofData.computerWins}
                  </p>
                  <p className="mt-1">
                    <strong>Draws:</strong> {proofData.draws}
                  </p>
                  <p className="mt-1">
                    <strong>Timestamp:</strong> {new Date(proofData.timestamp).toLocaleString()}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">View Full Proof</summary>
                    <p className="mt-1 break-all text-xs">{proofData.proof}</p>
                  </details>
                </div>
              </AlertDescription> */}
            </Alert>
          )}

          {proofStatus === "error" && (
            <Alert className="mt-4 max-w-md" variant="destructive">
              <AlertTitle className="flex items-center">
                <XCircle className="mr-2 h-4 w-4" />
                Error Generating Proof
              </AlertTitle>
              <AlertDescription>There was a problem generating your game proof. Please try again.</AlertDescription>
            </Alert>
          )}
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
          {gameHistory.length > 0 && (
            <div className="mb-4 text-sm flex items-center text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>All games will be included in the proof generation</span>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>You</TableHead>
                  <TableHead>Computer</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No games played yet
                    </TableCell>
                  </TableRow>
                ) : (
                  gameHistory.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>{emojis[game.user]}</TableCell>
                      <TableCell>{emojis[game.computer]}</TableCell>
                      <TableCell>{game.result === "win" ? "Win" : game.result === "lose" ? "Loss" : "Draw"}</TableCell>
                      <TableCell className="text-xs">{new Date(game.timestamp).toLocaleTimeString()}</TableCell>
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

