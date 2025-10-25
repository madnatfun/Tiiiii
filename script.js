let board = Array(9).fill("");
let currentPlayer = "X";
let mode = "";

const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const modeTitle = document.getElementById("modeTitle");
const inviteModal = document.getElementById("inviteModal");
const inviteLink = document.getElementById("inviteLink");

// --- Start game ---
function startGame(selectedMode){
  mode = selectedMode;
  menu.style.display = "none";
  gameContainer.style.display = "block";
  modeTitle.textContent = mode === "robot" ? "Play vs Robot 🤖" : "2 Players Offline 👥";
  board.fill("");
  currentPlayer = "X";
  cells.forEach(cell=>{
    cell.textContent="";
    cell.style.pointerEvents="auto";
    cell.classList.remove("winner");
  });
  message.textContent="";
}

// --- Check winner ---
function checkWinner(){
  const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let c of combos){
    const [a,b,c1]=c;
    if(board[a] && board[a]===board[b] && board[a]===board[c1]) return c;
  }
  return board.includes("")?null:"Draw";
}

// --- Update board ---
function updateGame(){
  cells.forEach((cell,idx)=>{cell.textContent=board[idx]; cell.classList.remove("winner");});
  const winnerCombo = checkWinner();
  if(winnerCombo){
    if(winnerCombo==="Draw"){
      message.textContent="It's a Draw!";
    } else {
      message.textContent=`Player ${board[winnerCombo[0]]} Wins! 🎉`;
      winnerCombo.forEach(idx=>cells[idx].classList.add("winner"));
      // Show invite modal for sharing
      if(mode==="robot" || mode==="offline") setTimeout(()=>{inviteModal.style.display="block";},500);
    }
    cells.forEach(cell=>cell.style.pointerEvents="none");
  }
}

// --- Robot move ---
function robotMove(){
  const empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  if(empty.length>0){
    const move = empty[Math.floor(Math.random()*empty.length)];
    board[move]=currentPlayer;
    currentPlayer = currentPlayer==="X"?"O":"X";
    updateGame();
  }
}

// --- Cell click ---
cells.forEach(cell=>{
  cell.addEventListener("click",()=>{
    const idx = cell.dataset.index;
    if(!board[idx]){
      board[idx]=currentPlayer;
      if(mode==="robot"){
        updateGame();
        currentPlayer = currentPlayer==="X"?"O":"X";
        robotMove();
      } else {
        currentPlayer = currentPlayer==="X"?"O":"X";
        updateGame();
      }
    }
  });
});

// --- Reset ---
resetBtn.addEventListener("click",()=>{
  gameContainer.style.display="none";
  menu.style.display="block";
  inviteModal.style.display="none";
});

// --- Invite modal ---
function closeModal(){inviteModal.style.display="none";}
function copyLink(){
  inviteLink.select();
  navigator.clipboard.writeText(inviteLink.value);
  alert("Link copied! Share with your friends 😎");
}