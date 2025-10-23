// Americano Tournament System
class AmericanoTournament {
    constructor() {
        this.players = [];
        this.courts = [];
        this.matches = [];
        this.scores = {};
        this.currentMatchIndex = 0;
        this.tournamentHistory = JSON.parse(localStorage.getItem('americanoHistory')) || [];
        
        this.initializeEventListeners();
        this.loadTournamentHistory();
    }

    initializeEventListeners() {
        // Generate tournament button
        document.getElementById('generateTournament')?.addEventListener('click', () => {
            this.generateTournament();
        });

        // Randomize names button
        document.getElementById('randomizeNames')?.addEventListener('click', () => {
            this.randomizePlayerNames();
        });

        // Confirm round button
        document.getElementById('confirmRound')?.addEventListener('click', () => {
            this.confirmRound();
        });


        // Toggle leaderboard button
        document.getElementById('toggleLeaderboard')?.addEventListener('click', () => {
            this.toggleLeaderboard();
        });
    }

    generateTournament() {
        const playerCount = parseInt(document.getElementById('playerCount').value);
        const courtCount = parseInt(document.getElementById('courtCount').value);

        if (!playerCount || !courtCount) {
            alert('Please select both number of players and courts');
            return;
        }

        if (courtCount > playerCount / 2) {
            alert('Number of courts cannot exceed half the number of players');
            return;
        }

        // Show player name input modal
        this.showPlayerNameModal(playerCount, courtCount);
    }

    randomizePlayerNames() {
        const playerCount = parseInt(document.getElementById('playerCount').value);
        if (!playerCount) {
            alert('Please select number of players first');
            return;
        }

        const randomNames = this.generateRandomNames(playerCount);
        this.fillPlayerNames(randomNames);
    }

    generateRandomNames(count) {
        const names = [
            'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley',
            'Gray', 'Harper', 'Ivy', 'Jordan', 'Kai', 'Lane',
            'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River',
            'Sage', 'Taylor', 'Unity', 'Vale', 'Winter', 'Xander',
            'Yael', 'Zion', 'Aria', 'Blake', 'Cora', 'Dex'
        ];
        
        // Shuffle and take the required number
        const shuffled = names.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    fillPlayerNames(names) {
        // If modal is open, fill the inputs
        const modal = document.querySelector('.player-name-modal');
        if (modal) {
            names.forEach((name, index) => {
                const input = document.getElementById(`player${index + 1}`);
                if (input) {
                    input.value = name;
                }
            });
        }
    }

    showPlayerNameModal(playerCount, courtCount) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'player-name-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Player Names</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Default names are pre-filled. You can edit them if needed:</p>
                    <div class="player-inputs" id="playerInputs">
                        ${this.generatePlayerInputs(playerCount)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelTournament">Cancel</button>
                    <button class="btn btn-primary" id="confirmTournament">Start Tournament</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-fill default names
        const defaultNames = this.generateDefaultNames(playerCount);
        defaultNames.forEach((name, index) => {
            const input = document.getElementById(`player${index + 1}`);
            if (input) {
                input.value = name;
            }
        });

        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#cancelTournament').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#confirmTournament').addEventListener('click', () => {
            const playerNames = this.getPlayerNames(playerCount);
            if (playerNames.length === playerCount) {
                modal.remove();
                this.startTournament(playerNames, courtCount);
            }
        });

        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
    }

    generateDefaultNames(count) {
        const names = [
            'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley',
            'Gray', 'Harper', 'Ivy', 'Jordan', 'Kai', 'Lane',
            'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River',
            'Sage', 'Taylor', 'Unity', 'Vale', 'Winter', 'Xander',
            'Yael', 'Zion', 'Aria', 'Cora', 'Dex', 'Eli'
        ];
        
        return names.slice(0, count);
    }

    generatePlayerInputs(count) {
        let inputs = '';
        for (let i = 1; i <= count; i++) {
            inputs += `
                <div class="player-input-group">
                    <label for="player${i}">Player ${i}:</label>
                    <input type="text" id="player${i}" class="player-name-input" placeholder="Enter player name" required>
                </div>
            `;
        }
        return inputs;
    }

    getPlayerNames(count) {
        const names = [];
        for (let i = 1; i <= count; i++) {
            const input = document.getElementById(`player${i}`);
            if (input && input.value.trim()) {
                names.push(input.value.trim());
            }
        }
        return names;
    }

    startTournament(playerNames, courtCount) {
        // Show loading state
        const generateBtn = document.getElementById('generateTournament');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Tournament...';
        generateBtn.disabled = true;

        setTimeout(() => {
            this.players = this.createPlayersFromNames(playerNames);
            this.courts = this.generateCourtNames(courtCount);
            this.matches = this.generateMatches();
            this.scores = this.initializeScores();
            this.currentMatchIndex = 0;

            this.displayTournament();
            this.showTournamentSection();
            this.hideSetupSection();

            // Reset button
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;

            // Show success message
            this.showSuccessMessage();
        }, 1000);
    }

    hideSetupSection() {
        const setupSection = document.querySelector('.tournament-setup');
        if (setupSection) {
            setupSection.style.display = 'none';
        }
        
        // Hide rules blocks
        const rulesSection = document.querySelector('.tournament-rules');
        if (rulesSection) {
            rulesSection.style.display = 'none';
        }
        
        // Hide the Americano System hero section
        const heroSection = document.querySelector('.americano-hero');
        if (heroSection) {
            heroSection.style.display = 'none';
        }
    }

    createPlayersFromNames(names) {
        return names.map((name, index) => ({
            id: index + 1,
            name: name,
            points: 0,
            matchesPlayed: 0,
            wins: 0,
            losses: 0
        }));
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>Tournament generated successfully!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }

    generatePlayerNames(count) {
        const names = [
            'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley',
            'Gray', 'Harper', 'Ivy', 'Jordan', 'Kai', 'Lane',
            'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River',
            'Sage', 'Taylor', 'Unity', 'Vale', 'Winter', 'Xander',
            'Yael', 'Zion'
        ];
        
        return names.slice(0, count).map((name, index) => ({
            id: index + 1,
            name: name,
            points: 0,
            matchesPlayed: 0,
            wins: 0,
            losses: 0
        }));
    }

    generateCourtNames(count) {
        const courtNames = ['Court 1', 'Court 2', 'Court 3', 'Court 4'];
        return courtNames.slice(0, count);
    }

    generateMatches() {
        const matches = [];
        const playerCount = this.players.length;
        
        // For Americano: each player partners with every other player exactly once
        // This creates (n-1) rounds where n is the number of players
        const totalRounds = playerCount - 1;
        
        // Generate rounds where each player partners with every other player
        for (let round = 0; round < totalRounds; round++) {
            const roundMatches = this.generateRoundMatches(round, playerCount);
            matches.push(...roundMatches);
        }
        
        return matches;
    }

    generateRoundMatches(round, playerCount) {
        const roundMatches = [];
        const players = [...this.players];
        
        // Rotate players for this round to ensure everyone plays with everyone
        const rotatedPlayers = this.rotatePlayers(players, round);
        
        // Create teams of 2 players each
        const teams = [];
        for (let i = 0; i < rotatedPlayers.length; i += 2) {
            if (i + 1 < rotatedPlayers.length) {
                teams.push({
                    id: teams.length + 1,
                    players: [rotatedPlayers[i], rotatedPlayers[i + 1]],
                    score: 0
                });
            }
        }
        
        // Create matches (2v2 Padel matches) - only create matches for available courts
        const courtCount = this.courts.length;
        for (let i = 0; i < teams.length && i < courtCount * 2; i += 2) {
            if (i + 1 < teams.length) {
                const match = {
                    id: `${round + 1}-${Math.floor(i/2) + 1}`,
                    round: round + 1,
                    matchNumber: Math.floor(i/2) + 1,
                    court: this.courts[Math.floor(i/2) % this.courts.length],
                    teams: [teams[i], teams[i + 1]],
                    status: 'pending',
                    completed: false
                };
                roundMatches.push(match);
            }
        }
        
        return roundMatches;
    }

    rotatePlayers(players, round) {
        // Rotate players for each round to ensure everyone plays with everyone
        const rotated = [...players];
        
        // Simple rotation: move first player to end
        for (let i = 0; i < round; i++) {
            const first = rotated.shift();
            rotated.push(first);
        }
        
        return rotated;
    }

    assignCourtsToMatches(matches) {
        const courtCount = this.courts.length;
        let courtIndex = 0;
        
        matches.forEach((match, index) => {
            match.court = this.courts[courtIndex];
            courtIndex = (courtIndex + 1) % courtCount;
        });
    }

    initializeScores() {
        const scores = {};
        this.players.forEach(player => {
            scores[player.id] = {
                points: 0,
                matchesPlayed: 0,
                wins: 0,
                losses: 0
            };
        });
        return scores;
    }

    displayTournament() {
        this.updateTournamentInfo();
        this.displayCurrentRound();
        this.displayLeaderboard();
    }

    updateTournamentInfo() {
        document.getElementById('tournamentPlayers').textContent = 
            `${this.players.length} Players`;
        document.getElementById('tournamentCourts').textContent = 
            `${this.courts.length} Courts`;
        document.getElementById('totalMatches').textContent = 
            `${this.matches.length} Matches`;
    }

    displayCurrentRound() {
        const currentMatches = this.getCurrentRoundMatches();
        if (!currentMatches || currentMatches.length === 0) {
            // Hide the entire current round section when tournament is complete
            const currentRoundSection = document.querySelector('.current-round');
            if (currentRoundSection) {
                currentRoundSection.style.display = 'none';
            }
            return;
        }

        // Update round title and progress
        const roundNumber = currentMatches[0].round;
        document.getElementById('roundTitle').textContent = `Round ${roundNumber}`;
        document.getElementById('roundProgress').textContent = `Round ${roundNumber} of 7`;

        // Display current matches
        const container = document.getElementById('currentMatches');
        container.innerHTML = '';

        // Show all matches for current round
        currentMatches.forEach((match, index) => {
            const matchBlock = document.createElement('div');
            matchBlock.className = 'match-block';
            matchBlock.innerHTML = `
                <div class="match-header">
                    <h4>${match.court}</h4>
                </div>
                <div class="padel-match">
                    <div class="team-vs-team">
                        <div class="team-block">
                            <div class="team-players">
                                <div class="team-label">${match.teams[0].players[0].name} & ${match.teams[0].players[1].name}</div>
                            </div>
                            <div class="score-input">
                                <label>Score:</label>
                                <input type="number" 
                                       class="score-field" 
                                       data-match-id="${match.id}" 
                                       data-team-id="${match.teams[0].id}" 
                                       value="${match.teams[0].score || 0}" 
                                       min="0" max="20" 
                                       placeholder="0-20">
                            </div>
                        </div>
                        
                        <div class="vs-divider">VS</div>
                        
                        <div class="team-block">
                            <div class="team-players">
                                <div class="team-label">${match.teams[1].players[0].name} & ${match.teams[1].players[1].name}</div>
                            </div>
                            <div class="score-input">
                                <label>Score:</label>
                                <input type="number" 
                                       class="score-field" 
                                       data-match-id="${match.id}" 
                                       data-team-id="${match.teams[1].id}" 
                                       value="${match.teams[1].score || 0}" 
                                       min="0" max="20" 
                                       placeholder="0-20">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(matchBlock);
        });

        // Add validation
        this.addScoreValidation();
    }

    getCurrentRoundMatches() {
        const currentRound = this.getCurrentRound();
        if (!currentRound) {
            console.log('No current round found');
            return [];
        }
        
        const roundMatches = this.matches.filter(match => match.round === currentRound && match.status === 'pending');
        console.log(`Round ${currentRound} matches:`, roundMatches);
        return roundMatches;
    }

    getCurrentRound() {
        const pendingMatches = this.matches.filter(match => match.status === 'pending');
        console.log('All matches:', this.matches);
        console.log('Pending matches:', pendingMatches);
        
        if (pendingMatches.length === 0) {
            console.log('No pending matches');
            return null;
        }
        
        const currentRound = pendingMatches[0].round;
        console.log('Current round:', currentRound);
        return currentRound;
    }

    getMatchesForCurrentRound() {
        const currentMatch = this.getCurrentMatch();
        if (!currentMatch) return [];
        
        // For now, show just the current match
        // Later we can show multiple matches if needed
        return [currentMatch];
    }

    addScoreValidation() {
        const scoreInputs = document.querySelectorAll('.score-field');
        scoreInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateRoundScores();
            });
        });
    }

    validateRoundScores() {
        const confirmBtn = document.getElementById('confirmRound');
        
        // NO VALIDATION - ALWAYS ENABLED
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Round & Continue';
    }

    displayScoring() {
        const container = document.getElementById('scoringContainer');
        const currentMatch = this.getCurrentMatch();
        
        if (!currentMatch) {
            container.innerHTML = '<p>All matches completed!</p>';
            return;
        }

        container.innerHTML = `
            <div class="current-match">
                <h4>Round ${currentMatch.round} - ${currentMatch.court}</h4>
                <p class="match-instruction">Enter scores for each team (total must equal 20 points)</p>
                <div class="teams-scoring">
                    ${currentMatch.teams.map(team => `
                        <div class="team-scoring">
                            <div class="team-info">
                                <h5>Team ${team.id}</h5>
                                <div class="team-players">
                                    ${team.players.map(player => `<span class="player-name">${player.name}</span>`).join(' & ')}
                                </div>
                            </div>
                            <div class="score-input-group">
                                <label>Score:</label>
                                <input type="number" class="score-input" 
                                       data-team-id="${team.id}" 
                                       value="${team.score || 0}" 
                                       min="0" max="20" 
                                       placeholder="0-20">
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="score-validation" id="scoreValidation"></div>
                <div class="score-buttons">
                    <button class="btn btn-primary" onclick="americanoTournament.updateScores()">
                        <i class="fas fa-save"></i> Update Scores
                    </button>
                    <button class="btn btn-success" onclick="americanoTournament.completeMatch()" id="completeBtn" disabled>
                        <i class="fas fa-check"></i> Complete Match
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for score validation
        this.addScoreValidationListeners();
    }

    addScoreValidationListeners() {
        const scoreInputs = document.querySelectorAll('.score-input');
        scoreInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateScores();
            });
        });
    }

    validateScores() {
        const scoreInputs = document.querySelectorAll('.score-input');
        const scores = Array.from(scoreInputs).map(input => parseInt(input.value) || 0);
        const total = scores.reduce((sum, score) => sum + score, 0);
        
        const validationDiv = document.getElementById('scoreValidation');
        const completeBtn = document.getElementById('completeBtn');
        
        if (total === 20) {
            validationDiv.innerHTML = '<div class="validation-success"><i class="fas fa-check"></i> Scores valid (total: 20)</div>';
            completeBtn.disabled = false;
        } else {
            validationDiv.innerHTML = `<div class="validation-error"><i class="fas fa-exclamation-triangle"></i> Total must be 20 (current: ${total})</div>`;
            completeBtn.disabled = true;
        }
    }

    displayLeaderboard() {
        const container = document.getElementById('leaderboardContainer');
        const sortedPlayers = [...this.players].sort((a, b) => b.points - a.points);
        
        let tableHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Matches</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sortedPlayers.forEach((player, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
            
            tableHTML += `
                <tr>
                    <td class="rank ${rankClass}">${rank}</td>
                    <td class="player-name">${player.name}</td>
                    <td class="points">${player.points}</td>
                    <td>${player.matchesPlayed}</td>
                    <td>${player.wins}</td>
                    <td>${player.losses}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    getCurrentMatch() {
        return this.matches.find(match => match.status === 'current') || 
               this.matches.find(match => match.status === 'pending');
    }

    updateScores() {
        const currentMatch = this.getCurrentMatch();
        if (!currentMatch) return;

        const scoreInputs = document.querySelectorAll('.score-input');
        scoreInputs.forEach(input => {
            const teamId = parseInt(input.dataset.teamId);
            const score = parseInt(input.value) || 0;
            const team = currentMatch.teams.find(t => t.id === teamId);
            if (team) {
                team.score = score;
            }
        });

        this.validateScores();
    }

    completeMatch() {
        const currentMatch = this.getCurrentMatch();
        if (!currentMatch) return;

        // Validate scores first
        const scoreInputs = document.querySelectorAll('.score-input');
        const scores = Array.from(scoreInputs).map(input => parseInt(input.value) || 0);
        const total = scores.reduce((sum, score) => sum + score, 0);
        
        if (total !== 20) {
            alert('Total scores must equal 20 points');
            return;
        }

        // Update team scores and player points
        currentMatch.teams.forEach(team => {
            const scoreInput = document.querySelector(`[data-team-id="${team.id}"]`);
            const score = parseInt(scoreInput.value) || 0;
            team.score = score;
            
            // Award points to each player in the team
            team.players.forEach(player => {
                const playerObj = this.players.find(p => p.id === player.id);
                if (playerObj) {
                    playerObj.points += score;
                    playerObj.matchesPlayed += 1;
                }
            });
        });

        currentMatch.status = 'completed';
        currentMatch.completed = true;
        
        this.currentMatchIndex++;
        this.updateMatchStatus();
        this.displaySchedule();
        this.displayLeaderboard();

        // Check if tournament is complete
        if (this.isTournamentComplete()) {
            this.completeTournament();
        } else {
            // Auto-advance to next match
            setTimeout(() => {
                this.displayScoring();
                this.showNextMatchMessage();
            }, 500);
        }
    }

    showNextMatchMessage() {
        const nextMatch = this.getCurrentMatch();
        if (nextMatch) {
            const message = document.createElement('div');
            message.className = 'next-match-message';
            message.innerHTML = `
                <div class="next-match-content">
                    <i class="fas fa-arrow-right"></i>
                    <span>Next: ${nextMatch.player1.name} vs ${nextMatch.player2.name}</span>
                </div>
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 300);
            }, 2000);
        }
    }

    updatePlayerStats(playerId, isWin, isTie = false) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.matchesPlayed++;
            if (isWin) {
                player.wins++;
                player.points += isTie ? 1 : 2; // 1 point for tie, 2 points for win
            } else {
                player.losses++;
                player.points += isTie ? 1 : 0; // 1 point for tie, 0 for loss
            }
        }
    }

    updateMatchStatus() {
        this.matches.forEach((match, index) => {
            if (index < this.currentMatchIndex) {
                match.status = 'completed';
            } else if (index === this.currentMatchIndex) {
                match.status = 'current';
            } else {
                match.status = 'pending';
            }
        });
    }

    isTournamentComplete() {
        return this.matches.every(match => match.status === 'completed');
    }

    completeTournament() {
        const winner = this.players.reduce((prev, current) => 
            (prev.points > current.points) ? prev : current
        );

        // Save to tournament history
        const tournamentResult = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            players: this.players.length,
            courts: this.courts.length,
            matches: this.matches.length,
            winner: winner.name,
            winnerPoints: winner.points,
            players: this.players.map(p => ({
                name: p.name,
                points: p.points,
                wins: p.wins,
                losses: p.losses
            }))
        };

        this.tournamentHistory.unshift(tournamentResult);
        localStorage.setItem('americanoHistory', JSON.stringify(this.tournamentHistory));
        this.loadTournamentHistory();

        // No popup - just show leaderboard
    }

    showTournamentSection() {
        const section = document.getElementById('tournamentDisplay');
        section.style.display = 'block';
        section.classList.add('show');
        section.scrollIntoView({ behavior: 'smooth' });
    }

    resetTournament() {
        if (confirm('Are you sure you want to reset the tournament? This will clear all progress.')) {
            this.players = [];
            this.courts = [];
            this.matches = [];
            this.scores = {};
            this.currentMatchIndex = 0;
            
            document.getElementById('tournamentDisplay').style.display = 'none';
            document.getElementById('playerCount').value = '';
            document.getElementById('courtCount').value = '';
        }
    }

    exportResults() {
        if (this.matches.length === 0) {
            alert('No tournament data to export. Please create a tournament first.');
            return;
        }

        const data = {
            tournament: {
                players: this.players.length,
                courts: this.courts.length,
                matches: this.matches.length,
                completed: this.isTournamentComplete()
            },
            players: this.players.map(p => ({
                name: p.name,
                points: p.points,
                matchesPlayed: p.matchesPlayed,
                wins: p.wins,
                losses: p.losses
            })),
            matches: this.matches.map(m => ({
                player1: m.player1.name,
                player2: m.player2.name,
                court: m.court,
                status: m.status,
                score: `${m.score1}-${m.score2}`,
                winner: m.winner ? this.players.find(p => p.id === m.winner).name : 'Tie'
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `americano-tournament-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    loadTournamentHistory() {
        const container = document.getElementById('historyContainer');
        
        if (this.tournamentHistory.length === 0) {
            container.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-history"></i>
                    <p>No tournaments completed yet. Create your first tournament above!</p>
                </div>
            `;
            return;
        }

        let historyHTML = '';
        this.tournamentHistory.forEach(tournament => {
            const winner = tournament.players.find(p => p.name === tournament.winner);
            historyHTML += `
                <div class="history-item">
                    <div class="history-info">
                        <h4>Tournament - ${tournament.date}</h4>
                        <p>${tournament.players} players, ${tournament.courts} courts, ${tournament.matches} matches</p>
                    </div>
                    <div class="history-winner">
                        <div class="winner-name">🏆 ${tournament.winner}</div>
                        <div class="winner-points">${tournament.winnerPoints} points</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = historyHTML;
    }

    getStatusText(status) {
        switch (status) {
            case 'pending': return 'Pending';
            case 'current': return 'Current';
            case 'completed': return 'Completed';
            default: return status;
        }
    }

    toggleLeaderboard() {
        const leaderboardSection = document.getElementById('leaderboardSection');
        if (leaderboardSection) {
            if (leaderboardSection.style.display === 'none') {
                leaderboardSection.style.display = 'block';
                this.displayLeaderboard();
            } else {
                leaderboardSection.style.display = 'none';
            }
        }
    }

    confirmRound() {
        const currentMatches = this.getCurrentRoundMatches();
        if (!currentMatches || currentMatches.length === 0) return;

        // NO VALIDATION - ACCEPT ANY SCORES

        // Update all matches in current round
        currentMatches.forEach(match => {
            const teams = match.teams;
            const team1 = teams[0];
            const team2 = teams[1];
            
            // Get scores for both teams
            const team1ScoreInput = document.querySelector(`[data-match-id="${match.id}"][data-team-id="${team1.id}"]`);
            const team2ScoreInput = document.querySelector(`[data-match-id="${match.id}"][data-team-id="${team2.id}"]`);
            
            const team1Score = parseInt(team1ScoreInput.value) || 0;
            const team2Score = parseInt(team2ScoreInput.value) || 0;
            
            team1.score = team1Score;
            team2.score = team2Score;
            
            // Award points to BOTH players in each team
            team1.players.forEach(player => {
                const playerObj = this.players.find(p => p.id === player.id);
                if (playerObj) {
                    playerObj.points += team1Score;
                    playerObj.matchesPlayed += 1;
                }
            });
            
            team2.players.forEach(player => {
                const playerObj = this.players.find(p => p.id === player.id);
                if (playerObj) {
                    playerObj.points += team2Score;
                    playerObj.matchesPlayed += 1;
                }
            });
            
            // Calculate wins and losses
            if (team1Score > team2Score) {
                // Team 1 wins
                team1.players.forEach(player => {
                    const playerObj = this.players.find(p => p.id === player.id);
                    if (playerObj) {
                        playerObj.wins += 1;
                    }
                });
                // Team 2 loses
                team2.players.forEach(player => {
                    const playerObj = this.players.find(p => p.id === player.id);
                    if (playerObj) {
                        playerObj.losses += 1;
                    }
                });
            } else if (team2Score > team1Score) {
                // Team 2 wins
                team2.players.forEach(player => {
                    const playerObj = this.players.find(p => p.id === player.id);
                    if (playerObj) {
                        playerObj.wins += 1;
                    }
                });
                // Team 1 loses
                team1.players.forEach(player => {
                    const playerObj = this.players.find(p => p.id === player.id);
                    if (playerObj) {
                        playerObj.losses += 1;
                    }
                });
            }
            // If scores are equal, no wins or losses added (draw)
            
            match.status = 'completed';
            match.completed = true;
        });
        
        this.displayCurrentRound();
        this.displayLeaderboard();

        // Check if tournament is complete
        if (this.isTournamentComplete()) {
            this.completeTournament();
        } else {
            // Show next round message
            this.showNextRoundMessage();
        }
    }

    showNextRoundMessage() {
        const nextMatch = this.getCurrentMatch();
        if (nextMatch) {
            const message = document.createElement('div');
            message.className = 'next-round-message';
            message.innerHTML = `
                <div class="next-round-content">
                    <i class="fas fa-arrow-right"></i>
                    <span>Round ${nextMatch.round} - ${nextMatch.court}</span>
                </div>
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 300);
            }, 2000);
        }
    }
}

// Initialize the tournament system when the page loads
let americanoTournament;
document.addEventListener('DOMContentLoaded', () => {
    americanoTournament = new AmericanoTournament();
});

// Add some utility functions for better UX
function validateInputs() {
    const playerCount = document.getElementById('playerCount').value;
    const courtCount = document.getElementById('courtCount').value;
    
    if (!playerCount || !courtCount) {
        return false;
    }
    
    if (parseInt(courtCount) > parseInt(playerCount) / 2) {
        alert('Number of courts cannot exceed half the number of players');
        return false;
    }
    
    return true;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        if (document.getElementById('generateTournament')) {
            americanoTournament.generateTournament();
        }
    }
});

// Form validation styling is handled in CSS files
