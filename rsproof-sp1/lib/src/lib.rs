use alloy_sol_types::sol;

sol! {
    /// The public values encoded as a struct that can be easily deserialized inside.
    struct PublicValuesStruct {
        uint32[2][] gameResult;
        uint32 winCount;
    }
}

// it is a rock paper scissors game 0 = rock, 1 = paper, 2 = scissors
pub fn compute_winner(game_result: Vec<[u32; 2]>) -> u32 {
    let mut player_wins = 0;
    let mut computer_wins = 0;

    for round in game_result.iter() {
        let player_move = round[0];
        let computer_move = round[1];
    
        if player_move == computer_move {
            continue; // Tie, no points
        }
       
        
        if (player_move == 0 && computer_move == 2) || 
           (player_move == 1 && computer_move == 0) || 
           (player_move == 2 && computer_move == 1) {  
            player_wins += 1;
        } else {
            computer_wins += 1;
        }
    }
    
    if player_wins == computer_wins {
        2 // Tie
    } else if player_wins > computer_wins {
        0 // Player wins
    } else {
        1 // Computer wins
    }
}