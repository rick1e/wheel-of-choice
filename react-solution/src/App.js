import './App.css';
import React, { useState } from 'react';



function App() {

  const [inputCountState, setInputCountState] = useState(0);

  var sectorCount = 2;
  var width = 200;
  var colorList = [
    "cc004c",
    "f37021",
    "fcb711",
    "0db14b",
    "0089d0",
    "6460aa",
    "cc004c",
    "f37021",
    "fcb711",
    "0db14b",
    "0089d0",
    "6460aa",
  ];

  var wheelOptions = [
    "Test 1",
    "Test 2",
    "Test 3",
    "Test 4",
    "Test 5",
    "Test 6",
    "Test 7",
    "Test 8",
    "Test 9",
    "Test 10",
    "Test 11",
    "Test 12"
  ]

  var wordList = [
    "rifle",
    "move",
    "back",
    "pie",
    "railway",
    "street",
    "shelf",
    "dinner",
    "pen",
    "rod",
    "border",
    "rings",
  ]
  var count = 0;
  var spinSpeed = 1;
  var selectedSector = Math.floor(Math.random() * sectorCount);


  function init() {
    window.requestAnimationFrame(draw);
  }

  function draw() {
    var angleOffset = ((2 * Math.PI) / 60) * count * spinSpeed;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    var [centerX, centerY, radius] = [width, width, width]
    for (var i = 0; i < sectorCount; i++) {
      var sectorAngle = 360 / sectorCount;
      var startAngle = (sectorAngle * i) * (Math.PI / 180) + angleOffset;
      var endAngle = (sectorAngle * (i + 1)) * (Math.PI / 180) + angleOffset;

      ctx.beginPath();
      ctx.fillStyle = "#" + colorList[i];
      ctx.strokeStyle = "#" + colorList[i];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.stroke();

      ctx.translate(width, width);
      ctx.rotate(startAngle + 0.5 * (endAngle - startAngle));
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.fillText(wheelOptions[i], 50, 10);
      ctx.rotate(-(startAngle + 0.5 * (endAngle - startAngle)));
      ctx.translate(-width, -width);

    }
    var currentAngle = (((angleOffset) * (180 / Math.PI))) % 360;
    var upperLimit = (720 + (-90 - (0.5 * (360 / sectorCount)) + 0.125 * (360 / sectorCount)) - ((360 / sectorCount) * selectedSector)) % 360;
    var lowerLimit = (720 + (-90 - (0.5 * (360 / sectorCount)) - 0.125 * (360 / sectorCount)) - ((360 / sectorCount) * selectedSector)) % 360;

    if (count > 400) {
      currentAngle = upperLimit;
      lowerLimit = upperLimit;
      console.log("force Stop");

    }

    if (count >= 100 && (currentAngle <= upperLimit && currentAngle >= lowerLimit)) {
      var elemWinner = document.getElementById('winner');
      elemWinner.innerHTML = wheelOptions[selectedSector];

    }

    if (count < 100 || !(currentAngle <= upperLimit && currentAngle >= lowerLimit)) {
      window.requestAnimationFrame(draw);
      count++;
    }

  }


  function handleSpin() {
    count = 0;
    var elemInputs = document.getElementsByTagName('input');
    sectorCount = elemInputs.length;
    selectedSector = Math.floor(Math.random() * sectorCount);
    wheelOptions = []
    var elemWinner = document.getElementById('winner');
    elemWinner.innerHTML = "";

    for (var i = 0; i < sectorCount; i++) {
      wheelOptions.push(elemInputs[i].value);
    }

    init();
  }

  function addOption() {
    var optionDiv = document.getElementById('options');
    var elemInputs = document.getElementsByTagName('input');
    var inputCount = elemInputs.length;
    var elemInputDiv = document.createElement('div');
    var elemInput = document.createElement('input');
    var elemButton = document.createElement('button');

    elemInput.value = wordList[Math.floor(Math.random() * wordList.length)]

    elemButton.innerHTML = "Remove";
    elemButton.onclick = function () {
      this.parentElement.remove();
      var elemInputs = document.getElementsByTagName('input');
      var inputCount = elemInputs.length;
      setInputCountState(inputCountState - 1);
      if (inputCount < 3) {
        var elemSpinButton = document.getElementById('spinButton');
        elemSpinButton.disabled = true;
      }

    };
    elemInputDiv.appendChild(elemInput);
    elemInputDiv.appendChild(elemButton);
    optionDiv.appendChild(elemInputDiv);

    setInputCountState(inputCountState + 1);

    if (inputCount >= 2) {

      var elemSpinButton = document.getElementById('spinButton');
      elemSpinButton.disabled = false;

    }
  }

  return (
    <div className="App">
      <div>
        <h2>Winner</h2>
        <span id="winner">
        </span>

      </div>

      <canvas id="myCanvas" width="400" height="400" style={{ border: '1px solid #000000' }}>
      </canvas>
      <button id="spinButton" onClick={handleSpin} disabled={inputCountState < 3}>
        Spin wheel
      </button>

      <button onClick={addOption}>
        Add Option
      </button>
      <div id="options">
      </div>

    </div>
  );
}

export default App;
