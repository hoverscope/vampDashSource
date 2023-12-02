document.addEventListener('DOMContentLoaded', function () {
    displayLeaderboard();
});

function displayLeaderboard() {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Sort users based on highScore in descending order
    users.sort((a, b) => b.highScore - a.highScore);

    // Display top 10 scores
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    for (let i = 0; i < Math.min(10, users.length); i++) {
        const user = users[i];
        const row = `<tr>
                        <td>${user.username}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.highScore}</td>
                    </tr>`;
        leaderboardBody.innerHTML += row;
    }
}
