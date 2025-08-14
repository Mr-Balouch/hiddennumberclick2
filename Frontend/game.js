const holes = document.querySelectorAll('.hole');
const scoreboard = document.getElementById('scoreboard');
const hitSound = document.getElementById('hit-sound');
const failSound = document.getElementById('fail-sound');

let round = 1;
let correctClicks = 0;
let numbersInHoles = [];

// Generate unique user ID
const userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

function startRound(){
  correctClicks = 0;
  numbersInHoles = [];

  holes.forEach(h => { 
    h.textContent=''; 
    h.dataset.number='0'; 
    h.classList.remove('correct','wrong');
  });

  let indices = [];
  while(indices.length<3){
    let r = Math.floor(Math.random()*6);
    if(!indices.includes(r)) indices.push(r);
  }

  indices.forEach(i => {
    holes[i].dataset.number = Math.floor(Math.random()*9)+1;
    numbersInHoles.push(i);
  });

  updateScoreboard();
}

function sendClickLog(holeId, isCorrect){
  fetch('https://17679768-eaee-4b15-9f09-bb54468c5ead-00-3ry3q4fj00yb8.spock.replit.dev', { // replace with your backend URL
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      userId: userId,
      round: round,
      holeId: holeId,
      result: isCorrect ? 'correct' : 'wrong'
    })
  }).catch(err => console.log('Logging error:', err));
}

function clickHole(e){
  const hole = e.currentTarget;
  const number = hole.dataset.number;
  if(number!=='0'){
    hitSound.currentTime=0; hitSound.play();
    hole.textContent = number;
    hole.classList.add('correct');
    hole.dataset.number='0';
    correctClicks++;
    sendClickLog(hole.dataset.id, true);

    if(correctClicks===3){
      round++;
      setTimeout(()=>{ startRound(); },500);
    }
  } else {
    failSound.currentTime=0; failSound.play();
    hole.classList.add('wrong');
    sendClickLog(hole.dataset.id, false);
    setTimeout(()=>{ alert(`Game Over! You reached Round ${round}`); round=1; startRound(); },500);
  }
  updateScoreboard();
}

function updateScoreboard(){
  scoreboard.textContent = `Round: ${round} | Correct: ${correctClicks}`;
}

holes.forEach(h => h.addEventListener('click',clickHole));

startRound();


