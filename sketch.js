let input;
let slider;
let button;
let selectElement;
let isBouncing = true;
// 定義顏色色票
const colors = ['#ffe5ec', '#ffc2d1', '#ffb3c6', '#ff8fab', '#fb6f92'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 建立文字輸入框並設定位置
  input = createInput('Hello🎵🌸🤍');
  input.position(20, 20);
  
  // 建立滑桿：最小值 15，最大值 80，預設值 30
  slider = createSlider(15, 80, 30);
  
  // 設定滑桿位置：位於輸入框右側 20px，並垂直置中
  let inputRect = input.elt.getBoundingClientRect();
  let sliderRect = slider.elt.getBoundingClientRect();
  slider.position(inputRect.right + 20, inputRect.top + (inputRect.height - sliderRect.height) / 2);

  // 建立按鈕
  button = createButton('暫停');
  button.mousePressed(() => { isBouncing = !isBouncing; button.html(isBouncing ? '暫停' : '開始'); });
  
  // 設定按鈕位置：位於滑桿右側 20px，並垂直置中
  let buttonRect = button.elt.getBoundingClientRect();
  button.position(inputRect.right + sliderRect.width + 40, inputRect.top + (inputRect.height - buttonRect.height) / 2);

  // 建立下拉式選單
  selectElement = createSelect();
  selectElement.option('淡江教科系', 'https://www.et.tku.edu.tw');
  selectElement.option('淡江大學', 'https://www.tku.edu.tw');
  
  // 設定選單位置：位於按鈕右側 20px，並垂直置中
  let selectRect = selectElement.elt.getBoundingClientRect();
  let buttonRectNew = button.elt.getBoundingClientRect();
  selectElement.position(buttonRectNew.right + 20, inputRect.top + (inputRect.height - selectRect.height) / 2);

  // 產生一個位於視窗中間的 DIV，四周保留 200px 距離，並嵌入網頁
  let div = createDiv();
  div.position(200, 100);
  div.size(windowWidth - 400, windowHeight - 200);
  div.style('opacity', '0.95');
  
  let iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.parent(div);
  
  // 建立關閉按鈕並放入 div 中
  let closeBtn = createButton('關閉視窗');
  closeBtn.parent(div);
  closeBtn.style('position', 'absolute');
  closeBtn.style('top', '10px');
  closeBtn.style('right', '10px');
  closeBtn.style('z-index', '10'); // 確保按鈕在 iframe 之上
  closeBtn.mousePressed(() => {
    div.hide();
  });

  // 當選單改變時，更新 iframe 網址並顯示視窗
  selectElement.changed(() => {
    iframe.attribute('src', selectElement.value());
    div.show();
  });
}

function draw() {
  background(220);
  
  let txt = input.value();
  let txtSize = slider.value(); // 取得滑桿數值
  textSize(txtSize);
  textAlign(LEFT, CENTER); // 設定文字垂直置中
  
  let w = textWidth(txt);
  // 確保文字寬度大於 0 才進行繪製，避免無窮迴圈
  if (w > 0) {
    // 從座標y為100開始，產生整個視窗的文字，排與排間間隔為50px
    for (let y = 100; y < height; y += 50) {
      let textCountX = 0; // 用於計算同行內的文字順序
      for (let x = 0; x < width; x += w) {
        // 計算垂直跳動偏移：加入 x 座標因素，讓同一排的文字也有波浪跳動效果
        let dy = 0;
        if (isBouncing) {
          dy = sin(frameCount * 0.1 + y * 0.05 + x * 0.02) * 15;
        }

        // 根據同行內的文字順序，從色票中循環取色
        const colorIndex = textCountX % colors.length;
        fill(colors[colorIndex]);
        noStroke(); // 移除文字邊框，讓顏色更清晰
        text(txt, x, y + dy);
        textCountX++; // 更新同行內的文字計數
      }
    }
  }
}
