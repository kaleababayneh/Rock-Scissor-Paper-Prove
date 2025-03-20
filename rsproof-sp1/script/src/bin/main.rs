use alloy_sol_types::SolType;
use clap::Parser;
use calculate_winner::PublicValuesStruct;
use sp1_sdk::{include_elf, ProverClient, SP1Stdin};

pub const ROCK_PAPER_SCISSORS_PROGRAM_ELF: &[u8] = include_elf!("rock-paper-scissors-program");

// New enum to represent the game outcome
#[derive(Debug)]
enum GameOutcome {
    UserWon,
    ComputerWon,
    Tie,
}

impl GameOutcome {
    // Convert winCount to GameOutcome
    fn from_win_count(count: u32) -> Self {
        match count {
            0 => GameOutcome::UserWon,
            1 => GameOutcome::ComputerWon,
            2 => GameOutcome::Tie,
            _ => panic!("Invalid win count: {}", count),
        }
    }
}

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(long)]
    execute: bool,

    #[clap(long)]
    prove: bool,
    
    #[clap(long, default_value = "[[0,1]]")]
    game_result: String,
}

fn main() {
    sp1_sdk::utils::setup_logger();
    dotenv::dotenv().ok();

    let args = Args::parse();

    // if args.execute == args.prove {
    //     eprintln!("Error: You must specify either --execute or --prove");
    //     std::process::exit(1);
    // }

    let client = ProverClient::from_env();

    let game_result: Vec<[u32; 2]> = serde_json::from_str(&args.game_result)
        .expect("Failed to parse game_result as JSON array of [u32; 2]");

    let mut stdin = SP1Stdin::new();
    stdin.write(&game_result);

    // if true{
    // let (output, report) = client.execute(ROCK_PAPER_SCISSORS_PROGRAM_ELF, &stdin).run().unwrap();
    // println!("Program executed successfully.");

    // let decoded = PublicValuesStruct::abi_decode(output.as_slice(), true).unwrap();
    // let PublicValuesStruct { gameResult, winCount } = decoded;
    // println!("Game Result: {:#?}", gameResult);
    // println!("Win Count: {:#?}", winCount);
    // // Use the enum to determine and print the outcome
    // let outcome = GameOutcome::from_win_count(winCount);
    // match outcome {
    //     GameOutcome::UserWon => println!("User has won!"),
    //     GameOutcome::ComputerWon => println!("Computer has won!"),
    //     GameOutcome::Tie => println!("It's a tie!"),
    // }

    // let expected_winner = calculate_winner::compute_winner(gameResult);
    // assert_eq!(winCount, expected_winner);
    // println!("Values are correct!");

    // println!("Number of cycles: {}", report.total_instruction_count());
    // } else {
        let (pk, vk) = client.setup(ROCK_PAPER_SCISSORS_PROGRAM_ELF);
        let proof = client
            .prove(&pk, &stdin)
            .run()
            .expect("failed to generate proof");

        let proof_path = "proof.bin";
        proof.save(proof_path).expect("failed to save proof");
        println!("Proof saved to file: {}", proof_path);

        println!("Successfully generated proof!");
        client.verify(&proof, &vk).expect("failed to verify proof");
        println!("Successfully verified proof!");
    // }
}