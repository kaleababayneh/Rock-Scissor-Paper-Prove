import { type NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

interface GameEntry {
  id: string;
  user: string;
  computer: string;
  result: string;
  timestamp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gameHistory: GameEntry[] = req.body.gameHistory

    const moveToNumber = (move: string): number => {
      switch (move.toLowerCase()) {
        case 'rock': return 0;
        case 'paper': return 1;
        case 'scissors': return 2;
        default: throw new Error(`Invalid move: ${move}`);
      }
    }

    const gameResult: number[][] = gameHistory.map(entry => [
      moveToNumber(entry.user),
      moveToNumber(entry.computer)
    ])

    const gameResultStr = JSON.stringify(gameResult);
    console.log("Game result string:", gameResultStr)

    const scriptPath = "/Users/kaleab/Documents/SP1RD/rsproof/rsproof-sp1/script"
    const command = `cd "${scriptPath}" &&  cargo run --bin main --release -- --game-result '${gameResultStr}'`;
    console.log("Command:", command)
    
    exec(command, (error: any, stdout: string, stderr: any) => {
        console.log("SP1 proof output:", stdout);
        if (stderr) console.error("SP1 proof errors:", stderr);
        
        if (error) {
            console.error("Error executing command:", error);
            return res.status(500).json({ error: "Failed to generate proof" });
        }

        return res.json({
          success: true,
          gameResult,  // You could include this in the response if needed
        })
    });

  } catch (error) {
    console.error("Error generating proof:", error)
    return res.status(500).json({ error: "Failed to generate proof" })
  }
}