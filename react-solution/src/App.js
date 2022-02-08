import './App.css';
import React, { useState } from 'react';


function App() {

  const localInputs = JSON.parse(localStorage.getItem('options'));
  const [inputList, setInputListState] = useState(localInputs != null ? localInputs : []);
  const [selectedSector, setSelectetdSector] = useState(0);
  const width = 200;
  const spinSpeed = 1;
  const colorList = [
    "cc004c",
    "f37021",
    "fcb711",
    "0db14b",
    "0089d0",
    "6460aa"
  ];
  const wordList = [
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


  let handleChange = (i, e) => {
    let newInputList = [...inputList];
    newInputList[i][e.target.name] = e.target.value;
    setInputListState(newInputList);
  }

  function removeOption(index) {
    let newInputList = [...inputList];
    newInputList.splice(index, 1);
    setInputListState(newInputList)
  }

  function addOption() {
    var newInputList = [...inputList, { option: wordList[Math.floor(Math.random() * wordList.length)] }]
    setInputListState(newInputList);

  }

  function init() {
    window.requestAnimationFrame(draw);
  }

  function draw() {

    var angleOffset = ((2 * Math.PI) / 60) * count * spinSpeed;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var sectorCount = inputList.length;
    var [centerX, centerY, radius] = [width, width, width]

    for (var i = 0; i < sectorCount; i++) {
      var sectorAngle = 360 / sectorCount;
      var startAngle = (sectorAngle * i) * (Math.PI / 180) + angleOffset;
      var endAngle = (sectorAngle * (i + 1)) * (Math.PI / 180) + angleOffset;

      ctx.beginPath();
      ctx.fillStyle = "#" + colorList[i % colorList.length];
      ctx.strokeStyle = "#" + colorList[i % colorList.length];
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
      ctx.fillText(inputList[i].option, 50, 10);
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
      console.log(inputList);
      console.log(selectedSector);
      elemWinner.innerHTML = inputList[selectedSector].option;

    }

    if (count < 100 || !(currentAngle <= upperLimit && currentAngle >= lowerLimit)) {
      window.requestAnimationFrame(draw);
      count++;
    }

  }


  function handleSpin() {
    count = 0;
    var sectorCount = inputList.length;
    setSelectetdSector(Math.floor(Math.random() * sectorCount));
    var elemWinner = document.getElementById('winner');
    elemWinner.innerHTML = "";
    localStorage.setItem('options', JSON.stringify(inputList))

    init();
  }
  /*
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
    */

  return (
    <div className="App">
      <div>
        <h2>Winner</h2>
        <span id="winner">
        </span>

      </div>

      <canvas id="myCanvas" width="400" height="400" style={{ border: '1px solid #000000' }}>
      </canvas>
      <button id="spinButton" onClick={handleSpin} disabled={inputList.length < 3}>
        Spin wheel
      </button>

      <button onClick={addOption}>
        Add Option
      </button>
      <div id="options">
        {inputList.map((element, index) => (
          <div>
            <input name="option" value={element.option || ""} onChange={e => handleChange(index, e)}>
            </input>
            <button onClick={() => removeOption(index)}>
              Remove
          </button>
          </div>
        ))
        }
      </div>

    </div>
  );
}

export default App;
