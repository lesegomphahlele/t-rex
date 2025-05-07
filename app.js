document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino')
    const grid = document.querySelector('.grid')
    const alert = document.getElementById('alert')
    const scoreDisplay = document.getElementById('score')
    const highScoreDisplay = document.getElementById('high-score')
    const restartArrow = document.getElementById('restart-arrow');
    let gravity = 0.9
    let isJumping = false
    let isGameOver = false
    let score = 0
    let scoreTimerId
    let highScore = 0

    // Load high score from localStorage or initialize to 0
    if (localStorage.getItem('trexHighScore')) {
        highScore = parseInt(localStorage.getItem('trexHighScore'), 10)
    }
    highScoreDisplay.textContent = `HI ${highScore}`

    // Start the score counter
    function startScoreCounter() {
        scoreTimerId = setInterval(() => {
            if (!isGameOver) {
                score++
                scoreDisplay.textContent = score

                // Update high score if beaten
                if (score > highScore) {
                    highScore = score
                    highScoreDisplay.textContent = `HI ${highScore}`
                    localStorage.setItem('trexHighScore', highScore)
                }
            }
        }, 100) // Increase score every 100ms
    }

    // Call this function to start the score counter
    startScoreCounter()

    restartArrow.addEventListener('click', () => {
        restartArrow.style.display = 'none'
        alert.innerHTML = ''
        isGameOver = false
        score = 0
        scoreDisplay.textContent = score
        position = 0
        dino.style.bottom = '0px'
        startScoreCounter()
        generateObstacles()
    })


    function control(e) { //passing in event to know which one on the keyboard is being pressed 
        if (e.code === 'Space') {
            if (!isJumping) {
                jump()
            }
            
        }
    }
    document.addEventListener('keydown', control)

    let position = 0
    function jump() {
        isJumping = true
        let count = 0
        let timerId = setInterval(function () {
            //move down
            if (count === 15) {
                clearInterval(timerId)
                let downTimerId = setInterval(function () {
                    //prevent the dino from falling off the screen
                    if (count === 0) {
                        clearInterval(downTimerId)
                        isJumping = false
                    }

                    position -= 5
                    count--
                    position = position * gravity
                    if (position < 0) position = 0  // Prevent going below ground
                    dino.style.bottom = position + 'px'
                }, 20)
            }

            //move up
            position += 30 //determines how how dino jumos
            count++
            position = position * gravity
            dino.style.bottom = position + 'px'
            
        }, 20)
    }

    function generateObstacles() {
        if (!isGameOver) {
            let randomTime = Math.random() * 3000
            let obstaclePosition = 1000
            const obstacle = document.createElement('div')
            obstacle.classList.add('obstacle')
            grid.appendChild(obstacle)
            obstacle.style.left = obstaclePosition + 'px'

            // Collision detection
            // Dino width: 118px, obstacle width: 50px
            // Check if obstacle is within dino's horizontal range (0 to 118)
            let timerId = setInterval(function () {
                obstaclePosition -= 10
                obstacle.style.left = obstaclePosition + 'px'

                //if both dino and obstacle are in the same place
                if (obstaclePosition > 0 && obstaclePosition < 118  && position < 60) {
                    clearInterval(timerId)
                    clearInterval(scoreTimerId) // Stop the score counter
                    alert.innerHTML = "Game Over"
                    isGameOver = true
                    restartArrow.style.display = 'block'

                    //remove all obstacles from the grid
                    /* while (grid.firstChild) { //check if theres a first child then continously remove last child
                        grid.removeChild(grid.lastChild)
                    } */
                    
                    // Remove only obstacles, keep the dino
                    const obstacles = grid.querySelectorAll('.obstacle')  
                    obstacles.forEach(obstacle => grid.removeChild(obstacle))
                }
                    
            }, 20)
            //generating more obstacles
            setTimeout(generateObstacles, randomTime)
        }
    } 
    generateObstacles()
})


            