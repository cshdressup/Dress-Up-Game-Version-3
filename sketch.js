let skins = [], faces = [], hairs = [], shirts = [], pants = [], shoes = [], hats = [];
let sparkles = [], confetti = [];

let isIntro = true;
let isInstructions = false;
let instructionsSpoken = false;
let introSpoken = false; 
let introTimer = 110; 
let textScale = 0;
let osc, env;
let nextOsc, nextEnv; 
let jinglePlayed = false;

let nextBtn, selectBtn, resetBtn, startBtn;

let skinNames = ["Dark Skin Tone", "Medium Skin Tone 1", "Medium Skin Tone 2", "Light Skin Tone"];
let faceNames = ["Smiley Face", "Silly Face", "Neutral Face"];
let hairNames = ["Short Straight Hair", "Short Wavy Hair", "Short Curly Hair", "Long Wavy Hair", "Long Curly Hair", "Long Straight Ponytail"];
let hairColorNames = ["Black", "Brown", "Blonde"];
let shirtNames = ["Blue Tee", "Black Tee w/ Bow", "Red Tank", "Yellow Sweater", "Grey Striped Tee", "Green Tank", "Pink Tee w/ Heart"];

// FIXED: Matching 4 names to 4 specific color definitions
let pantsNames = ["Black Pants", "White Pants", "Black Skirt", "White Skirt"];
let pantsColors = ["#494949", "#f1f1f1", "#494949", "#f1f1f1"]; 

let shoeNames = ["Red Sneakers", "Brown Cowboy Boots", "Pink Sneakers"];
let hatNames = ["No Hat", "Round Glasses", "Black Baseball Cap", "Pink Bow"];

let hairColors = ["#221006", "#6a3a17", "#ffd699"];

let currentCategory = "Skin Tones", tempIndex = -1, appearanceScale = 1.0; 
let selectedSkin = 3, selectedFace = 0, selectedHair = 2, selectedHairColor = 1;      
let selectedShirt = 0, selectedPantsIdx = 0, selectedShoes = 0, selectedHat = -1;         

let showFinal = false;
const IMG_W = 700, IMG_H = 393.75;
const PLAYFUL_FONT = 'Fredoka One, cursive'; 
const UI_FONT = 'Montserrat, sans-serif'; 

let synth = window.speechSynthesis, preferredVoice = null;

function loadVoices() {
  let voices = synth.getVoices();
  preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang.includes('en-US')) || voices[0];
}
window.speechSynthesis.onvoiceschanged = loadVoices;

function preload() {
  for (let i = 0; i <= 3; i++) skins.push(loadImage('assets/skin' + i + '.png'));
  for (let i = 0; i <= 2; i++) faces.push(loadImage('assets/face' + i + '.png'));
  for (let i = 0; i <= 5; i++) hairs.push(loadImage('assets/hair' + i + '.png'));
  for (let i = 0; i <= 6; i++) shirts.push(loadImage('assets/shirt' + i + '.png'));
  for (let i = 0; i <= 1; i++) pants.push(loadImage('assets/pants' + i + '.png'));
  for (let i = 0; i <= 2; i++) shoes.push(loadImage('assets/shoes' + i + '.png'));
  for (let i = 0; i <= 2; i++) 
hats.push(loadImage('assets/hat' + i + '.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity()); 
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  env = new p5.Envelope();
  env.setADSR(0.01, 0.1, 0.2, 0.1);
  env.setRange(0.5, 0);
  osc = new p5.Oscillator('triangle');
  osc.start();
  osc.amp(0);

  nextEnv = new p5.Envelope();
  nextEnv.setADSR(0.01, 0.05, 0.1, 0.05);
  nextEnv.setRange(0.3, 0);
  nextOsc = new p5.Oscillator('sine');
  nextOsc.start();
  nextOsc.amp(0);

  nextBtn = createButton('NEXT ❯');
  nextBtn.mousePressed(() => { playNextSound(); cycleOptions(); });
  
  selectBtn = createButton('SELECT ★');
  selectBtn.mousePressed(() => { playSelectSound(); selectOption(); });
  
  resetBtn = createButton('REPLAY ❯❯');
  resetBtn.mousePressed(() => { playSelectSound(); resetGame(); });

  startBtn = createButton('START GAME');
  startBtn.mousePressed(() => { 
    userStartAudio();
    playSelectSound();
    isInstructions = false;
    startBtn.hide();
    nextBtn.show(); 
    selectBtn.show();
    speakDescription("Let's style your character. Pick a skin tone.");
  });

  repositionUI(); 
  nextBtn.hide();
  selectBtn.hide();
  resetBtn.hide();
  startBtn.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionUI();
}

function repositionUI() {
  styleButton(nextBtn, width / 2 - 165, height - 80);
  styleButton(selectBtn, width / 2 + 5, height - 80);
  styleButton(resetBtn, width / 2 - 80, height - 80);
  styleButton(startBtn, width / 2 - 80, height / 2 + 100);
}

function draw() {
  if (isIntro) {
    runIntroAnimation();
  } else if (isInstructions) {
    drawInstructions();
  } else {
    gameLoop();
  }
}

function runIntroAnimation() {
  setGradient(0, 0, width, height, color(130, 80, 180), color(80, 160, 100));
  handleSparkles();

  if (!introSpoken) {
    speakDescription("Dress Up Game!");
    introSpoken = true;
  }

  if (!jinglePlayed) {
    playJingle();
    jinglePlayed = true;
  }

  let bounce = sin(frameCount * 0.15) * 0.08;
  textScale = lerp(textScale, 1.1 + bounce, 0.1);

  push();
  translate(width / 2, height / 2);
  scale(textScale);
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.6)';
  noFill();
  stroke(255, 160); 
  strokeWeight(8);
  drawStar(0, 0, 180, 380, 5); 
  fill(255);
  textFont(PLAYFUL_FONT);
  textSize(min(width * 0.1, 72));
  text("Dress Up\nGame!", 0, 0);
  pop();

  introTimer--;
  if (introTimer <= 0) {
    isIntro = false;
    isInstructions = true;
    startBtn.show();
  }
}

function drawInstructions() {
  setGradient(0, 0, width, height, color(130, 80, 180), color(80, 160, 100));
  handleSparkles();

  if (!instructionsSpoken) {
    speakDescription("How to play. Click Next to cycle through styles. Click Select to make your choice. Go through all categories to see your final look! Press the start button when you are ready.");
    instructionsSpoken = true;
  }

  fill(255);
  textFont(PLAYFUL_FONT);
  textSize(48);
  text("HOW TO PLAY", width / 2, height / 2 - 150);

  textFont(UI_FONT);
  textSize(22);
  let instText = "Click NEXT to cycle through styles\nClick SELECT to make your choice\nGo through all categories to see your final look!";
  text(instText, width / 2, height / 2 - 20);
}

function gameLoop() {
  setGradient(0, 0, width, height, color(130, 80, 180), color(80, 160, 100));
  drawEnvironmentalLight();
  handleSparkles();
  handleConfetti();

  appearanceScale = lerp(appearanceScale, 1.0, 0.12); 

  if (!showFinal) {
    nextBtn.show(); selectBtn.show(); resetBtn.hide();
    drawAvatar();
    drawUI();
  } else {
    nextBtn.hide(); selectBtn.hide(); resetBtn.show();
    drawFinal();
  }
}

function drawAvatar() {
  let x = width / 2;
  let baseY = height / 2 + 20;
  let levitate = cos(frameCount * 0.05) * 8; 
  let y = baseY + levitate;
  let dynamicScale = min(width / 800, height / 700);
  
  drawSharedPlatform(x, baseY + (175 * dynamicScale), levitate);

  push();
  translate(x, y);
  scale(appearanceScale * dynamicScale); 

  const renderImg = (img, cat, tintCol, isSkin = false, indexVal = -1) => {
    if (!img) return;
    
    if (isSkin && indexVal === 3) {
      tint(255, 255); 
    } else if (tintCol) {
      tint(tintCol);
    } else {
      noTint();
    }

    if (currentCategory === cat && tempIndex !== -1) {
      drawingContext.shadowBlur = 30; 
      drawingContext.shadowColor = 'rgba(255, 255, 255, 0.6)'; 
    } else {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = 'rgba(0, 0, 0, 0.15)';
    }
    image(img, 0, 0, IMG_W, IMG_H);
  };

  let skinIdx = currentCategory === "Skin Tones" && tempIndex !== -1 ? tempIndex : selectedSkin;
  renderImg(skins[skinIdx], "Skin Tones", null, true, skinIdx);
  
  renderImg((currentCategory === "Facial Expressions" && tempIndex !== -1) ? faces[tempIndex] : faces[selectedFace], "Facial Expressions");
  renderImg((currentCategory === "Shoes" && tempIndex !== -1) ? shoes[tempIndex] : shoes[selectedShoes], "Shoes");

  // FIXED: Logic to pick pants vs skirt image based on index
  let pIdxVal = (currentCategory === "Pants and Skirts" && tempIndex !== -1) ? tempIndex : selectedPantsIdx;
  let pImgFile = pIdxVal < 2 ? pants[0] : pants[1]; // 0,1 = Pants | 2,3 = Skirt
  renderImg(pImgFile, "Pants and Skirts", pantsColors[pIdxVal]);

  renderImg((currentCategory === "Shirts" && tempIndex !== -1) ? shirts[tempIndex] : shirts[selectedShirt], "Shirts");

  let hImg = (currentCategory === "Hairstyles" && tempIndex !== -1) ? hairs[tempIndex] : hairs[selectedHair];
  let hCol = (currentCategory === "Hair Colors" && tempIndex !== -1) ? hairColors[tempIndex] : hairColors[selectedHairColor];
  renderImg(hImg, (currentCategory === "Hairstyles" || currentCategory === "Hair Colors" ? currentCategory : ""), hCol);

  // FIXED: Hat logic to correctly handle "No Hat" (index 0) and Headband (index 4)
  let hatIdxVal = (currentCategory === "Hats" && tempIndex !== -1) ? tempIndex : (selectedHat + 1);
  if (hatIdxVal > 0) {
      renderImg(hats[hatIdxVal - 1], "Hats");
  }
  
  pop();
}

function styleButton(btn, x, y) {
  btn.position(x, y); 
  btn.size(160, 45);
  btn.style('background-color', '#ffffff'); 
  btn.style('border', 'none');
  btn.style('border-radius', '25px'); 
  btn.style('font-family', UI_FONT);
  btn.style('font-size', '16px'); 
  btn.style('font-weight', '600');
  btn.style('color', '#4b2a6d'); 
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '0 4px 0 #8250b4');
}

function playJingle() {
  let notes = [523.25, 659.25, 783.99]; 
  let time = 0;
  notes.forEach(note => {
    setTimeout(() => {
      osc.freq(note);
      env.play(osc);
    }, time);
    time += 150;
  });
}

function playNextSound() {
  nextOsc.freq(880);
  nextEnv.play(nextOsc);
}

function playSelectSound() {
  osc.freq(523.25); 
  env.play(osc);
  setTimeout(() => {
    osc.freq(1046.50); 
    env.play(osc);
  }, 100);
}

function drawEnvironmentalLight() {
  noStroke();
  fill(120, 80, 255, 12); 
  rect(0, 0, width, height);
}

function drawSharedPlatform(x, platformY, levitate) {
  push();
  noStroke();
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.15)'; 
  fill(255, 30); ellipse(x, platformY, 400, 120);
  fill(255, 80); ellipse(x, platformY, 350, 100);
  pop();
  let sa = map(levitate, -8, 8, 20, 55);
  fill(0, sa); 
  ellipse(x, platformY, map(levitate, -8, 8, 165, 215), map(levitate, -8, 8, 42, 58));
}

function drawUI() {
  noStroke();
  textFont(PLAYFUL_FONT);
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';
  fill(255); textSize(42); 
  text(currentCategory.toUpperCase(), width / 2, 55);
  drawingContext.shadowBlur = 0;

  let optName = getCurrentOptionName();
  if (optName !== "") {
    fill(255, 160); 
    textSize(22);
    text("Current: " + optName, width / 2, 95);
  }
}

function drawFinal() {
  let dynamicScale = min(width / 800, height / 700);
  let x = width / 2, baseY = height / 2 + 20, levitate = cos(frameCount * 0.05) * 8, y = baseY + levitate;
  drawSharedPlatform(x, baseY + (175 * dynamicScale), levitate);
  
  push();
  translate(x, y);
  scale(dynamicScale);
  
  if (skins[selectedSkin]) {
    if (selectedSkin === 3) tint(255, 255); else noTint();
    image(skins[selectedSkin], 0, 0, IMG_W, IMG_H);
  }
  
  noTint();
  if (faces[selectedFace]) image(faces[selectedFace], 0, 0, IMG_W, IMG_H);
  if (shoes[selectedShoes]) image(shoes[selectedShoes], 0, 0, IMG_W, IMG_H);
  
  push(); 
  let pImgFile = selectedPantsIdx < 2 ? pants[0] : pants[1];
  tint(pantsColors[selectedPantsIdx]); 
  if (pImgFile) image(pImgFile, 0, 0, IMG_W, IMG_H); 
  pop();

  if (shirts[selectedShirt]) image(shirts[selectedShirt], 0, 0, IMG_W, IMG_H);
  
  push(); 
  tint(hairColors[selectedHairColor]); 
  if (hairs[selectedHair]) image(hairs[selectedHair], 0, 0, IMG_W, IMG_H); 
  pop();

  // FIXED: Final screen hat rendering
  if (selectedHat >= 0 && hats[selectedHat]) {
    image(hats[selectedHat], 0, 0, IMG_W, IMG_H);
  }
  pop();

  fill(255); noStroke();
  textFont(PLAYFUL_FONT); textSize(60); 
  text("SO STYLISH!", width / 2, 80);
}

function cycleOptions() {
  appearanceScale = 0.92; 
  tempIndex++; 
  let cats = ["Skin Tones", "Facial Expressions", "Hairstyles", "Hair Colors", "Shirts", "Pants and Skirts", "Shoes", "Hats"];
  let lists = [skinNames, faceNames, hairNames, hairColorNames, shirtNames, pantsNames, shoeNames, hatNames];
  let idx = cats.indexOf(currentCategory);
  if (tempIndex >= lists[idx].length) tempIndex = 0;
  speakDescription(getCurrentOptionName());
}

function selectOption() {
  appearanceScale = 0.85; 
  let selection = tempIndex === -1 ? getCategoryDefault() : tempIndex;

  if (currentCategory === "Skin Tones") { selectedSkin = selection; currentCategory = "Facial Expressions"; }
  else if (currentCategory === "Facial Expressions") { selectedFace = selection; currentCategory = "Hairstyles"; }
  else if (currentCategory === "Hairstyles") { selectedHair = selection; currentCategory = "Hair Colors"; }
  else if (currentCategory === "Hair Colors") { selectedHairColor = selection; currentCategory = "Shirts"; }
  else if (currentCategory === "Shirts") { selectedShirt = selection; currentCategory = "Pants and Skirts"; }
  else if (currentCategory === "Pants and Skirts") { 
    selectedPantsIdx = selection;
    currentCategory = "Shoes"; 
  }
  else if (currentCategory === "Shoes") { selectedShoes = selection; currentCategory = "Hats"; }
  else if (currentCategory === "Hats") { 
    // FIXED: Correct indexing for hat images (0-3) vs names (0-4)
    selectedHat = selection - 1; 
    showFinal = true; 
    triggerConfetti(); 
    speakDescription("Wow, that's so stylish! What a great outfit!");
  }

  tempIndex = -1; 
  if (!showFinal) speakDescription("Next: " + currentCategory);
}

function speakDescription(txt) {
  synth.cancel(); 
  let msg = new SpeechSynthesisUtterance(txt);
  if (preferredVoice) msg.voice = preferredVoice;
  msg.pitch = 1.2; msg.rate = 1.0; 
  synth.speak(msg);
}

function triggerConfetti() { for (let i = 0; i < 120; i++) confetti.push(new Confetti()); }

function handleSparkles() {
  if (random(1) > 0.85) sparkles.push(new Sparkle());
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update(); sparkles[i].display();
    if (sparkles[i].alpha <= 0) sparkles.splice(i, 1);
  }
}

function handleConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update(); confetti[i].display();
    if (confetti[i].life <= 0) confetti.splice(i, 1);
  }
}

function getCurrentOptionName() {
  let cats = ["Skin Tones", "Facial Expressions", "Hairstyles", "Hair Colors", "Shirts", "Pants and Skirts", "Shoes", "Hats"];
  let lists = [skinNames, faceNames, hairNames, hairColorNames, shirtNames, pantsNames, shoeNames, hatNames];
  let idx = cats.indexOf(currentCategory);
  return (tempIndex === -1) ? "" : lists[idx][tempIndex];
}

function getCategoryDefault() {
  let defaults = [3, 0, 2, 1, 0, 0, 0, 0];
  let cats = ["Skin Tones", "Facial Expressions", "Hairstyles", "Hair Colors", "Shirts", "Pants and Skirts", "Shoes", "Hats"];
  return defaults[cats.indexOf(currentCategory)];
}

function resetGame() {
  resetBtn.hide(); 
  nextBtn.hide();
  selectBtn.hide();
  isIntro = true;
  isInstructions = false;
  instructionsSpoken = false;
  introSpoken = false; 
  introTimer = 110;
  textScale = 0;
  jinglePlayed = false;
  showFinal = false; 
  currentCategory = "Skin Tones"; 
  tempIndex = -1; 
  appearanceScale = 1.0;
  selectedSkin = 3; selectedFace = 0; selectedHair = 2; selectedHairColor = 1;
  selectedShirt = 0; selectedPantsIdx = 0; selectedShoes = 0; selectedHat = -1;
  confetti = []; 
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c); line(x, i, x + w, i);
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

class Confetti {
  constructor() {
    this.x = width/2; this.y = height/2;
    this.vel = p5.Vector.random2D().mult(random(3, 12));
    this.gravity = 0.2; this.col = color(random(255), random(255), random(255));
    this.size = random(6, 12); this.life = 255; this.rot = random(TWO_PI);
  }
  update() { this.x += this.vel.x; this.y += this.vel.y; this.vel.y += this.gravity; this.life -= 3; this.rot += 0.1; }
  display() {
    push(); translate(this.x, this.y); rotate(this.rot);
    noStroke(); fill(red(this.col), green(this.col), blue(this.col), this.life);
    rect(0, 0, this.size, this.size); pop();
  }
}

class Sparkle {
  constructor() { this.x = random(width); this.y = random(height); this.size = random(2, 6); this.alpha = 255; this.fade = random(2, 5); }
  update() { this.alpha -= this.fade; }
  display() {
    noStroke(); fill(255, 255, 255, this.alpha);
    push(); translate(this.x, this.y); rotate(frameCount * 0.1);
    rectMode(CENTER); rect(0, 0, this.size, this.size); rect(0, 0, this.size/3, this.size*2); rect(0, 0, this.size*2, this.size/3);
    pop();
  }
}