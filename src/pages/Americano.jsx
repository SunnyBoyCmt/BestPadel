import React, { useState, useEffect } from 'react'
import './Americano.css'

const Americano = () => {
  const [playerCount, setPlayerCount] = useState('')
  const [courtCount, setCourtCount] = useState('')
  const [tournament, setTournament] = useState(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [playerNames, setPlayerNames] = useState([])
  const [showNameModal, setShowNameModal] = useState(false)

  const defaultNames = [
    'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley',
    'Gray', 'Harper', 'Ivy', 'Jordan', 'Kai', 'Lane',
    'Morgan', 'Nova', 'Ocean', 'Parker'
  ]

  // Load tournament from localStorage on component mount
  useEffect(() => {
    const savedTournament = localStorage.getItem('bestpadel-tournament')
    if (savedTournament) {
      try {
        const parsedTournament = JSON.parse(savedTournament)
        // Validate tournament structure
        if (parsedTournament.players && parsedTournament.rounds && parsedTournament.currentRound) {
          setTournament(parsedTournament)
          setCurrentRound(parsedTournament.currentRound || 1)
          console.log('Tournament restored from localStorage')
        } else {
          console.warn('Invalid tournament data in localStorage, clearing...')
          localStorage.removeItem('bestpadel-tournament')
        }
      } catch (error) {
        console.error('Error loading tournament from localStorage:', error)
        localStorage.removeItem('bestpadel-tournament')
      }
    }
  }, [])

  // Save tournament to localStorage whenever it changes
  useEffect(() => {
    if (tournament) {
      try {
        const tournamentToSave = {
          ...tournament,
          lastSaved: new Date().toISOString()
        }
        localStorage.setItem('bestpadel-tournament', JSON.stringify(tournamentToSave))
        console.log('Tournament saved to localStorage')
      } catch (error) {
        console.error('Error saving tournament to localStorage:', error)
      }
    }
  }, [tournament])

  const generateTournament = () => {
    if (!playerCount || !courtCount) {
      alert('Please select both number of players and courts')
      return
    }

    // Auto-fill names
    const names = defaultNames.slice(0, parseInt(playerCount))
    setPlayerNames(names)
    setShowNameModal(true)
  }

  const startTournament = (names) => {
    const players = names.map((name, index) => ({
      id: index + 1,
      name: name,
      points: 0,
      wins: 0,
      losses: 0,
      matchesPlayed: 0
    }))

    const courts = Array.from({ length: parseInt(courtCount) }, (_, i) => `Court ${i + 1}`)
    
    // Generate rounds with unique partnerships
    const rounds = generateTournamentRounds(players, courts)
    const totalRounds = rounds.length

    setTournament({
      players,
      courts,
      rounds,
      totalRounds,
      currentRound: 1,
      completedRounds: 0
    })
    setShowNameModal(false)
  }

  const generateTournamentRounds = (players, courts) => {
    const rounds = []
    const playerCount = players.length
    const usedPartnerships = new Set()
    
    // For Americano format, we need (n-1) rounds where n is number of players
    const totalRounds = playerCount - 1
    
    for (let round = 1; round <= totalRounds; round++) {
      const roundMatches = generateRoundMatches(players, courts, round, usedPartnerships)
      rounds.push({
        roundNumber: round,
        matches: roundMatches
      })
    }
    
    return rounds
  }

  const generateRoundMatches = (players, courts, roundNumber, usedPartnerships) => {
    const availablePlayers = [...players]
    const matches = []
    const roundPartnerships = new Set()
    
    // Create partnerships for this round ensuring no duplicates
    while (availablePlayers.length >= 2) {
      // Find a valid partnership that hasn't been used before
      let team1 = null
      let team2 = null
      
      for (let i = 0; i < availablePlayers.length; i++) {
        for (let j = i + 1; j < availablePlayers.length; j++) {
          const player1 = availablePlayers[i]
          const player2 = availablePlayers[j]
          const partnership = `${Math.min(player1.id, player2.id)}-${Math.max(player1.id, player2.id)}`
          
          if (!usedPartnerships.has(partnership) && !roundPartnerships.has(partnership)) {
            team1 = [player1, player2]
            usedPartnerships.add(partnership)
            roundPartnerships.add(partnership)
            break
          }
        }
        if (team1) break
      }
      
      if (!team1) {
        // If no valid partnership found, create one anyway (fallback)
        team1 = [availablePlayers[0], availablePlayers[1]]
        const partnership = `${Math.min(team1[0].id, team1[1].id)}-${Math.max(team1[0].id, team1[1].id)}`
        usedPartnerships.add(partnership)
        roundPartnerships.add(partnership)
      }
      
      // Remove selected players from available list
      availablePlayers.splice(availablePlayers.indexOf(team1[0]), 1)
      availablePlayers.splice(availablePlayers.indexOf(team1[1]), 1)
      
      // Find second team
      if (availablePlayers.length >= 2) {
        for (let i = 0; i < availablePlayers.length; i++) {
          for (let j = i + 1; j < availablePlayers.length; j++) {
            const player1 = availablePlayers[i]
            const player2 = availablePlayers[j]
            const partnership = `${Math.min(player1.id, player2.id)}-${Math.max(player1.id, player2.id)}`
            
            if (!usedPartnerships.has(partnership) && !roundPartnerships.has(partnership)) {
              team2 = [player1, player2]
              usedPartnerships.add(partnership)
              roundPartnerships.add(partnership)
              break
            }
          }
          if (team2) break
        }
        
        if (!team2) {
          // Fallback for second team
          team2 = [availablePlayers[0], availablePlayers[1]]
          const partnership = `${Math.min(team2[0].id, team2[1].id)}-${Math.max(team2[0].id, team2[1].id)}`
          usedPartnerships.add(partnership)
          roundPartnerships.add(partnership)
        }
        
        // Remove second team from available list
        availablePlayers.splice(availablePlayers.indexOf(team2[0]), 1)
        availablePlayers.splice(availablePlayers.indexOf(team2[1]), 1)
      }
      
      // Create match
      const courtIndex = matches.length % courts.length
      matches.push({
        id: `round-${roundNumber}-match-${matches.length + 1}`,
        round: roundNumber,
        matchNumber: matches.length + 1,
        court: courts[courtIndex],
        teams: [
          {
            id: `round-${roundNumber}-team-1`,
            players: team1,
            score: 0
          },
          {
            id: `round-${roundNumber}-team-2`,
            players: team2,
            score: 0
          }
        ],
        status: 'pending',
        completed: false
      })
    }
    
    return matches
  }

  const getCurrentRoundMatches = () => {
    if (!tournament) return []
    const currentRoundData = tournament.rounds.find(round => round.roundNumber === currentRound)
    return currentRoundData ? currentRoundData.matches : []
  }

  const confirmRound = () => {
    const currentMatches = getCurrentRoundMatches()
    
    // Update scores and points
    currentMatches.forEach(match => {
      match.teams.forEach(team => {
        const scoreInput = document.querySelector(`[data-match-id="${match.id}"][data-team-id="${team.id}"]`)
        const score = parseInt(scoreInput?.value) || 0
        team.score = score
        
        // Award points to both players
        team.players.forEach(player => {
          const playerObj = tournament.players.find(p => p.id === player.id)
          if (playerObj) {
            playerObj.points += score
            playerObj.matchesPlayed += 1
          }
        })
      })
      
      // Calculate wins and losses for this match
      const team1Score = match.teams[0].score
      const team2Score = match.teams[1].score
      
      if (team1Score > team2Score) {
        // Team 1 wins
        match.teams[0].players.forEach(player => {
          const playerObj = tournament.players.find(p => p.id === player.id)
          if (playerObj) {
            playerObj.wins += 1
          }
        })
        match.teams[1].players.forEach(player => {
          const playerObj = tournament.players.find(p => p.id === player.id)
          if (playerObj) {
            playerObj.losses += 1
          }
        })
      } else if (team2Score > team1Score) {
        // Team 2 wins
        match.teams[1].players.forEach(player => {
          const playerObj = tournament.players.find(p => p.id === player.id)
          if (playerObj) {
            playerObj.wins += 1
          }
        })
        match.teams[0].players.forEach(player => {
          const playerObj = tournament.players.find(p => p.id === player.id)
          if (playerObj) {
            playerObj.losses += 1
          }
        })
      }
      // If draw (team1Score === team2Score), no wins or losses are added
      
      match.status = 'completed'
      match.completed = true
    })

    // Update tournament state with completed round
    const updatedTournament = {
      ...tournament,
      currentRound: currentRound + 1,
      completedRounds: tournament.completedRounds + 1
    }
    
    // Save to localStorage immediately
    try {
      const tournamentToSave = {
        ...updatedTournament,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('bestpadel-tournament', JSON.stringify(tournamentToSave))
      console.log('Round completed and saved to localStorage')
    } catch (error) {
      console.error('Error saving tournament after round completion:', error)
    }
    
    setTournament(updatedTournament)

    // Check if tournament is complete
    if (currentRound >= tournament.totalRounds) {
      // Tournament complete - show final leaderboard
      console.log('Tournament completed!')
      return
    }

    setCurrentRound(currentRound + 1)
  }

  const resetTournament = () => {
    setTournament(null)
    setCurrentRound(1)
    setPlayerNames([])
    localStorage.removeItem('bestpadel-tournament')
  }

  if (showNameModal) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Player Names</h3>
            <button onClick={() => setShowNameModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <p>Default names are pre-filled. You can edit them if needed:</p>
            <div className="player-inputs">
              {playerNames.map((name, index) => (
                <div key={index} className="player-input-group">
                  <label>Player {index + 1}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...playerNames]
                      newNames[index] = e.target.value
                      setPlayerNames(newNames)
                    }}
                    className="player-name-input"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setShowNameModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={() => startTournament(playerNames)} className="btn btn-primary">
              Start Tournament
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (tournament) {
    const currentMatches = getCurrentRoundMatches()
    const isTournamentComplete = currentRound > tournament.totalRounds
    const completedMatches = tournament.rounds.reduce((total, round) => 
      total + round.matches.filter(match => match.completed).length, 0)
    const totalMatches = tournament.rounds.reduce((total, round) => 
      total + round.matches.length, 0)
    
    return (
      <div className="americano-page">
        <div className="americano-hero">
          <div className="container">
            <h1>Americano Tournament</h1>
            {isTournamentComplete ? (
              <p>Tournament Complete! 🏆</p>
            ) : (
              <p>Round {currentRound} of {tournament.totalRounds} • {completedMatches}/{totalMatches} matches completed</p>
            )}
          </div>
        </div>
        
        <div className="americano-content">
          <div className="container">
            <div className="tournament-display">
              {!isTournamentComplete && (
                <div className="current-round">
                  <div className="round-header">
                    <h3>Round {currentRound}</h3>
                    <div className="round-info">
                      <span>{tournament.players.length} Players • {tournament.courts.length} Courts</span>
                    </div>
                  </div>
                  
                  <div className="matches-container">
                    {currentMatches.map((match, index) => (
                      <div key={match.id} className="match-block">
                        <div className="match-header">
                          <h4>{match.court}</h4>
                        </div>
                        <div className="padel-match">
                          <div className="team-vs-team">
                            <div className="team-block">
                              <div className="team-players">
                                <div className="team-label">
                                  {match.teams[0].players[0].name} & {match.teams[0].players[1].name}
                                </div>
                              </div>
                              <div className="score-input">
                                <label>Score:</label>
                                <input
                                  type="number"
                                  className="score-field"
                                  data-match-id={match.id}
                                  data-team-id={match.teams[0].id}
                                  defaultValue={match.teams[0].score || 0}
                                  min="0"
                                  max="20"
                                  placeholder="0-20"
                                />
                              </div>
                            </div>
                            
                            <div className="vs-divider">VS</div>
                            
                            <div className="team-block">
                              <div className="team-players">
                                <div className="team-label">
                                  {match.teams[1].players[0].name} & {match.teams[1].players[1].name}
                                </div>
                              </div>
                              <div className="score-input">
                                <label>Score:</label>
                                <input
                                  type="number"
                                  className="score-field"
                                  data-match-id={match.id}
                                  data-team-id={match.teams[1].id}
                                  defaultValue={match.teams[1].score || 0}
                                  min="0"
                                  max="20"
                                  placeholder="0-20"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="round-actions">
                    <button onClick={confirmRound} className="btn btn-primary btn-large">
                      <span>✓</span>
                      Confirm Round & Continue
                    </button>
                  </div>
                </div>
              )}
              
              <div className="tournament-controls">
                <button onClick={resetTournament} className="btn btn-secondary">
                  <span>🔄</span>
                  Reset Tournament
                </button>
              </div>
              
              <div className="leaderboard">
                <h3>Leaderboard</h3>
                <div className="leaderboard-container">
                  {tournament.players
                    .sort((a, b) => b.points - a.points)
                    .map((player, index) => (
                      <div key={player.id} className="leaderboard-item">
                        <div className="rank">#{index + 1}</div>
                        <div className="player-info">
                          <h4>{player.name}</h4>
                          <div className="player-stats">
                            <span>{player.points} pts</span>
                            <span>{player.wins}W-{player.losses}L</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="americano-page">
      <div className="americano-hero">
        <div className="container">
          <h1>Americano System</h1>
          <p>The fairest tournament format where every player competes with every other player</p>
        </div>
      </div>
      
      <div className="americano-content">
        <div className="container">
          <div className="tournament-setup">
            <h2>Create Your Tournament</h2>
            <p>Enter the number of players and courts to generate your Americano tournament</p>
            
            <div className="setup-form">
              <div className="form-group">
                <label>Number of Players</label>
                <select 
                  value={playerCount} 
                  onChange={(e) => setPlayerCount(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select number of players</option>
                  <option value="4">4 Players</option>
                  <option value="6">6 Players</option>
                  <option value="8">8 Players</option>
                  <option value="10">10 Players</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Number of Courts</label>
                <select 
                  value={courtCount} 
                  onChange={(e) => setCourtCount(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select number of courts</option>
                  <option value="1">1 Court</option>
                  <option value="2">2 Courts</option>
                  <option value="3">3 Courts</option>
                  <option value="4">4 Courts</option>
                </select>
              </div>
              
              <button onClick={generateTournament} className="btn btn-primary btn-large">
                <span>🏆</span>
                Generate Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Americano
