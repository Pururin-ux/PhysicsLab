let currentVelocity = 5;
let startX = 0;
let isResetting = false;

const liveXEl = document.getElementById('live-x');
const liveTEl = document.getElementById('live-t');

function setScenario(mode) {
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));

  let btnId = mode === 'forward' ? 'btn-fwd' : mode === 'still' ? 'btn-still' : 'btn-back';
  document.getElementById(btnId).classList.add('active');

  isResetting = true;
  startX = 0;

  if (mode === 'forward') currentVelocity = 5;
  if (mode === 'still') currentVelocity = 0;
  if (mode === 'backward') currentVelocity = -5;
}

function toggleAnswer(btn) {
  const ans = btn.nextElementSibling;
  ans.style.display = (ans.style.display === 'block') ? 'none' : 'block';
}

function toggleHint(btn) {
  const hint = btn.nextElementSibling;
  hint.style.display = (hint.style.display === 'block') ? 'none' : 'block';
}

const sketch = (p) => {
  let t = 0;
  let path = [];
  let w, h;
  let motionH, graphH;
  const TIME_SCALE = 30;
  const POS_SCALE = 4;

  p.setup = () => {
    let container = document.getElementById('canvas-wrapper');
    w = container.offsetWidth;
    h = container.offsetHeight;
    motionH = h * 0.35;
    graphH = h * 0.65;
    let cnv = p.createCanvas(w, h);
    cnv.parent('canvas-wrapper');
    p.textFont('JetBrains Mono');
  };

  p.windowResized = () => {
    let container = document.getElementById('canvas-wrapper');
    w = container.offsetWidth;
    h = container.offsetHeight;
    motionH = h * 0.35;
    graphH = h * 0.65;
    p.resizeCanvas(w, h);
  };

  p.draw = () => {
    p.background('#111');

    if (isResetting || t > 15) {
      t = 0;
      path = [];
      isResetting = false;
    }

    let centerX = w / 2;

    // ДВИЖЕНИЕ
    p.push();
    p.stroke(60); p.strokeWeight(1);
    p.line(0, motionH/2 + 20, w, motionH/2 + 20);

    p.textAlign(p.CENTER); p.textSize(10); p.noStroke();

    for(let i = 0; i < w/2; i+=40) {
      let xRight = centerX + i;
      let valRight = (i / POS_SCALE).toFixed(0);
      if (valRight % 10 === 0) {
        p.fill(80); p.rect(xRight, motionH/2 + 15, 1, 10);
        p.text(valRight, xRight, motionH/2 + 40);
      } else if (valRight % 5 === 0) {
        p.fill(50); p.rect(xRight, motionH/2 + 18, 1, 4);
      }
      if (i > 0) {
        let xLeft = centerX - i;
        if (valRight % 10 === 0) {
          p.fill(80); p.rect(xLeft, motionH/2 + 15, 1, 10);
          p.text("-" + valRight, xLeft, motionH/2 + 40);
        } else if (valRight % 5 === 0) {
          p.fill(50); p.rect(xLeft, motionH/2 + 18, 1, 4);
        }
      }
    }

    let displacement = (startX + currentVelocity * t) * POS_SCALE;
    let pixelPos = centerX + displacement;

    if(pixelPos >= -20 && pixelPos <= w+20) {
      p.fill('#ffee00'); p.noStroke();
      p.circle(pixelPos, motionH/2 + 20, 14);

      if (Math.abs(currentVelocity) > 0.1) {
        let arrowLen = currentVelocity * 6;
        p.stroke('#3b82f6'); p.strokeWeight(2);
        p.line(pixelPos, motionH/2, pixelPos + arrowLen, motionH/2);
        p.noStroke(); p.fill('#3b82f6');
        p.triangle(pixelPos + arrowLen, motionH/2 - 3, pixelPos + arrowLen, motionH/2 + 3, pixelPos + arrowLen + (currentVelocity>0?5:-5), motionH/2);
      }
    }
    p.pop();

    // ГРАФИК
    p.push();
    let gOrigX = 40;
    let gOrigY = motionH + (graphH / 2);
    p.translate(gOrigX, gOrigY);

    p.stroke(100); p.strokeWeight(2);
    p.line(0, 0, w - 80, 0);
    p.noStroke(); p.fill(200); p.text("t (с)", w - 60, -10);

    p.stroke(100);
    p.line(0, -(graphH/2)+20, 0, (graphH/2)-20);
    p.noStroke(); p.fill(200); p.text("x (м)", 10, -(graphH/2)+30);

    p.stroke(40); p.strokeWeight(1); p.textSize(9); p.textAlign(p.RIGHT, p.CENTER);

    for(let i=0; i<(w-80); i+=TIME_SCALE) {
      let timeVal = (i / TIME_SCALE).toFixed(0);
      if (i > 0) {
        p.stroke(40); p.line(i, -(graphH/2)+20, i, (graphH/2)-20);
        p.noStroke(); p.fill(80); p.text(timeVal, i, 15);
      }
    }

    for(let j=0; j<(graphH/2)-20; j+=40) {
      let meters = (j / (POS_SCALE/2)).toFixed(0);
      if (j > 0) {
        p.stroke(40); p.line(0, -j, w-80, -j);
        p.noStroke(); p.fill(80); p.text(meters, -5, -j);
        p.stroke(40); p.line(0, j, w-80, j);
        p.noStroke(); p.fill(80); p.text("-" + meters, -5, j);
      } else {
        p.noStroke(); p.fill(80); p.text("0", -5, 0);
      }
    }

    let currentGraphY = -displacement / 2;

    if (p.frameCount % 2 == 0) {
      path.push({ tx: t * TIME_SCALE, ty: currentGraphY });
    }

    p.noFill(); p.stroke('#ffee00'); p.strokeWeight(2);
    p.beginShape();
    for (let pt of path) {
      if (pt.tx < w - 80 && pt.ty > -graphH/2 && pt.ty < graphH/2) {
        p.vertex(pt.tx, pt.ty);
      }
    }
    p.endShape();

    let curTX = t * TIME_SCALE;
    if (curTX < w - 80 && Math.abs(currentGraphY) < graphH/2) {
      p.fill('#ffee00'); p.noStroke();
      p.circle(curTX, currentGraphY, 6);
      p.stroke(80); p.strokeWeight(1); p.drawingContext.setLineDash([4, 4]);
      p.line(curTX, 0, curTX, currentGraphY);
      p.line(0, currentGraphY, curTX, currentGraphY);
      p.drawingContext.setLineDash([]);
    }
    p.pop();

    liveXEl.innerText = (startX + currentVelocity * t).toFixed(1);
    liveTEl.innerText = t.toFixed(1);
    t += 0.03;
  };
};

new p5(sketch);