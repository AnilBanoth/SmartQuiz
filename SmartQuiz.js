const subdomains = {
  science:["general"],
  maths:["general"],
  computer:["python","c","java","html","javascript"],
  history:["general"]
};

const questions = {
  science: { general: [
    {q:"What is H2O?",options:["Oxygen","Water","Hydrogen","Salt"],answer:1},
    {q:"Earth revolves around?",options:["Moon","Sun","Mars","Venus"],answer:1},
    {q:"Human blood is?",options:["Blue","Red","Green","Yellow"],answer:1},
    {q:"Speed of light?",options:["3x10^8 m/s","3x10^6 m/s","1x10^5 m/s","None"],answer:0},
    {q:"Gas in balloons?",options:["Helium","Oxygen","Hydrogen","Nitrogen"],answer:0},
    {q:"Unit of Force?",options:["Newton","Joule","Pascal","Watt"],answer:0},
    {q:"Planet closest to Sun?",options:["Venus","Earth","Mercury","Mars"],answer:2},
    {q:"Center of atom?",options:["Electron","Proton","Nucleus","Neutron"],answer:2},
    {q:"Photosynthesis uses?",options:["CO2","O2","H2","N2"],answer:0},
    {q:"Largest organ?",options:["Liver","Skin","Heart","Brain"],answer:1}
  ]},
  maths: { general: [
    {q:"5+7=?",options:["12","13","14","10"],answer:0},
    {q:"Square root of 81?",options:["7","8","9","10"],answer:2},
    {q:"Value of π?",options:["3.14","2.17","3.41","1.41"],answer:0},
    {q:"10*10=?",options:["100","1000","10","110"],answer:0},
    {q:"50% of 200?",options:["50","200","100","150"],answer:2},
    {q:"Solve: 15-6?",options:["5","9","10","8"],answer:1},
    {q:"7*6=?",options:["42","36","48","40"],answer:0},
    {q:"100/25=?",options:["2","3","4","5"],answer:2},
    {q:"Cube of 3?",options:["9","18","27","36"],answer:2},
    {q:"LCM of 4 & 6?",options:["12","6","8","10"],answer:0}
  ]}
};

let currentQ = 0, score = 0, quizQ = [], timer, timeLeft, maxTime;

function startQuiz() {
  const domain = document.getElementById("domain").value;
  const sub = document.getElementById("subdomain").value;
  maxTime = parseInt(document.getElementById("time").value);
  quizQ = [...questions[domain][sub]];
  currentQ = 0; score = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQ >= quizQ.length) { showResults(); return; }
  const q = quizQ[currentQ];
  const quizArea = document.getElementById("quizArea");
  quizArea.innerHTML = `
    <div class="question">${q.q}</div>
    <div class="options">
      ${q.options.map((o,i)=>`<button onclick="checkAnswer(${i})">${o}</button>`).join("")}
    </div>
  `;
  updateProgress();
  resetCircle();
  timeLeft = maxTime;
  document.getElementById("timerText").innerText = timeLeft;
  timer = setInterval(()=>{
    timeLeft--;
    updateCircle();
    document.getElementById("timerText").innerText = timeLeft;
    document.getElementById("tickSound").play();
    if(timeLeft<=0){clearInterval(timer); nextQ();}
  },1000);
}

function checkAnswer(i){
  clearInterval(timer);
  const q=quizQ[currentQ];
  const btns=document.querySelectorAll(".options button");
  if(i===q.answer){
    score++;
    btns[i].classList.add("correct");
    document.getElementById("correctSound").play();
  } else {
    btns[i].classList.add("wrong");
    btns[q.answer].classList.add("correct");
    document.getElementById("wrongSound").play();
  }
  setTimeout(nextQ,1000);
}

function nextQ(){currentQ++; showQuestion();}

function showResults(){
  const quizArea = document.getElementById("quizArea");
  if(score > 5){
    quizArea.innerHTML=`
      <div class="results">🎉 Congratulations!<br>Your Score: ${score}/${quizQ.length}</div>
      <button onclick="downloadScore()">Download Score</button>
    `;
    launchConfetti();
  } else {
    quizArea.innerHTML=`
      <div class="results">😔 Try Again to Score More!<br>Your Score: ${score}/${quizQ.length}</div>
      <button onclick="startQuiz()">Retry Quiz</button>
      <button onclick="downloadScore()">Download Score</button>
    `;
  }
}

function downloadScore(){
  const element = document.createElement("a");
  const content = `Your Quiz Score: ${score}/${quizQ.length}`;
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = "quiz_score.txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function updateProgress(){
  document.getElementById("progressBar").style.width=`${(currentQ/quizQ.length)*100}%`;
}

function resetCircle(){
  const circle=document.querySelector(".circle-progress");
  const circumference=283;
  circle.style.strokeDasharray=circumference;
  circle.style.strokeDashoffset=0;
}

function updateCircle(){
  const circle=document.querySelector(".circle-progress");
  const circumference=283;
  const offset=circumference-(timeLeft/maxTime)*circumference;
  circle.style.strokeDashoffset=offset;
}

document.getElementById("domain").addEventListener("change",e=>{
  const subs=subdomains[e.target.value];
  const subSel=document.getElementById("subdomain");
  subSel.innerHTML=subs.map(s=>`<option value="${s}">${s}</option>`).join("");
});

// Simple confetti effect
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];
  const colors = ["#ff2e63","#08d9d6","#ff9f1c","#fff200","#6a4c93"];
  for(let i=0;i<150;i++){
    pieces.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*6+2, d:Math.random()*50, color: colors[Math.floor(Math.random()*colors.length)], tilt: Math.random()*10-10});
  }
  let angle = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x + p.tilt, p.y);
      ctx.lineTo(p.x + p.tilt + p.r/2, p.y + p.r);
      ctx.lineTo(p.x + p.tilt - p.r/2, p.y + p.r);
      ctx.closePath();
      ctx.fill();
    });
    update();
  }
  function update(){
    angle += 0.01;
    pieces.forEach(p=>{
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;
      p.x += Math.sin(angle) * 2;
      if(p.y>canvas.height){p.y=-10; p.x=Math.random()*canvas.width;}
    });
    requestAnimationFrame(draw);
  }
  draw();
}