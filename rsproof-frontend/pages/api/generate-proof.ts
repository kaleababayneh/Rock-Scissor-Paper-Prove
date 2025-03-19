import { type NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const data = await request.json()
    // const { userChoice, computerChoice, result, timestamp } = data

    // // Validate the input
    // if (!userChoice || !computerChoice || !result) {
    //   return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    // }

    // // Create a unique proof by hashing the game data with a timestamp
    // const proofData = JSON.stringify({
    //   userChoice,
    //   computerChoice,
    //   result,
    //   timestamp,
    //   // You could add a secret key here for additional security
    //   secret: "secret-key",
    // })

    // const proof = crypto.createHash("sha256").update(proofData).digest("hex")

    // // Create a verification code (shorter version for display)
    // const verificationCode = proof.substring(0, 8).toUpperCase()

    return res.json({
      success: true,
    //   proof,
    //   verificationCode,
    //   timestamp,
    //   message: "Game result verified and recorded",
    })
  } catch (error) {
    console.error("Error generating proof:", error)
    return res.status(500).json({ error: "Failed to generate proof" })
  }
}

