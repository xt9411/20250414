let circles = [];

function splitUnity(parts) {
    let result = [];
    let sum = 0;
    for (let i = 0; i < parts; i++) {
        let p = random(1, parts);
        sum += p;
        result.push(p);
    }
    for (let i = 0; i < parts; i++) result[i] /= sum;
    return result;
}

function makeRects() {
    let rects = [];
    let xparts = splitUnity(n);
    let yparts = splitUnity(n);
    let ysum = 0;
    for (let i = 0; i < n; i++) {
        rects[i] = { w: xparts[i] * width, h: yparts[i] * height, y: ysum };
        ysum += rects[i].h;
    }
    shuffle(rects, true);
    let xsum = 0;
    for (let i = 0; i < n; i++) {
        rects[i].x = xsum;
        xsum += rects[i].w;
    }
    return rects;
}

const n = 50;
let rects, D, phase, lastPhase;
let showIntroduction = false;

function setup() {
    // 設置全螢幕畫布
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0); // 將畫布定位到視窗的左上角
    canvas.style('z-index', '-1'); // 將動畫背景畫布移至選單下方
    canvas.style('position', 'absolute'); // 確保畫布定位正確
    rects = makeRects();
    phase = lastPhase = 'grow';

    // 設定背景顏色
    background("#220c4e4");

    // 產生圓形
    for (let i = 0; i < 40; i++) {
        let circle = {
            x: random(width),
            y: random(height),
            size: random(30, 50),
            color: color(random(255), random(255), random(255))
        };
        circles.push(circle);
    }

    // 建立選單
    createMenu();
}

function draw() {
    let t = (millis() / 300) % 20; // 計算動畫時間
    let [currentPhase, u] =
        t < 10
            ? t < 2
                ? ['grow', t / 2]
                : ['stretch', (t - 2) / 8]
            : t - 10 < 8
            ? ['shorten', (t - 10) / 8]
            : ['shrink', (t - 18) / 2];

    // 如果階段改變，重置 rects
    if (currentPhase !== phase) {
        phase = currentPhase;
        rects = makeRects();
    }

    // 清除畫布並重設背景
    background(255);

    // 根據當前階段繪製動畫
    fill(0);
    switch (phase) {
        case 'grow':
            for (let { x, y, w, h } of rects) {
                let dw = w * u;
                let dh = h * u;
                rect(x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
            }
            break;
        case 'stretch':
            for (let { x, y, w, h } of rects) {
                let dw = 2 * width * u;
                rect(x - dw / 2, y, w + dw, h);
            }
            break;
        case 'shorten':
            for (let { x, y, w, h } of rects) {
                let dh = 2 * height * (1 - u);
                rect(x, y - dh / 2, w, h + dh);
            }
            break;
        case 'shrink':
            for (let { x, y, w, h } of rects) {
                let dw = w * (1 - u);
                let dh = h * (1 - u);
                rect(x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
            }
            break;
    }

    lastPhase = phase;

    // 當動畫完成一個循環時，重置階段
    if (t >= 19.9) {
        phase = 'grow';
        lastPhase = 'shrink';
    }

    // 在左上角繪製黑色方塊和文字，確保它們在最上層
    let blueValue = map(mouseX, 0, width, 100, 255); // 藍色值從 100 到 255 之間變化
    textSize(24); // 設定文字大小
    let textWidthValue = textWidth("淡江大學教育學系"); // 計算文字的寬度
    let textHeightValue = textAscent() + textDescent(); // 計算文字的高度

    fill(0); // 設定方塊顏色為黑色
    rect(10, 30 - textHeightValue, textWidthValue, textHeightValue); // 繪製黑色方塊

    fill(0, 0, blueValue); // 設定文字顏色為深藍到淺藍
    text("淡江大學教育學系", 10, 30); // 在左上角繪製文字，座標為 (10, 30)

    // 如果 showIntroduction 為 true，繪製自我介紹內容
    if (showIntroduction) {
        fill(0, 255, 0); // 設定方塊顏色為綠色
        rect(width / 2 - 150, height / 2 - 50, 300, 100); // 繪製方塊

        fill(0); // 設定文字顏色為黑色
        textSize(24); // 設定文字大小
        textAlign(CENTER, CENTER); // 文字置中
        text("我是413730606黃宣禔", width / 2, height / 2); // 繪製文字
    }
}

// 當視窗大小改變時，調整畫布大小
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    rects = makeRects(); // 重新生成矩形數據以適應新的畫布大小
}

function createMenu() {
    // 建立選單的容器
    let menu = createDiv();
    menu.id('menu');
    menu.style('position', 'absolute');
    menu.style('top', '10px');
    menu.style('right', '10px'); // 一開始就顯示選單
    menu.style('padding', '10px');
    menu.style('background', '#ffffff');
    menu.style('border-radius', '10px');
    menu.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    menu.style('z-index', '1'); // 確保選單在畫布之上

    // 選單項目
    let items = ['首頁', '自我介紹', '作品集', '測驗卷', '教學影片', '筆記'];
    let ul = createElement('ul');
    ul.style('list-style', 'none');
    ul.style('margin', '0');
    ul.style('padding', '0');

    for (let item of items) {
        let li = createElement('li', item);
        li.style('padding', '8px 16px');
        li.style('margin', '25px 0'); // 每個項目上下間距為 50px（上下各 25px）
        li.style('background', '#4f772d');
        li.style('color', '#ffffff');
        li.style('border-radius', '5px');
        li.style('cursor', 'pointer');
        li.style('transition', 'background 0.3s');
        li.style('font-size', '30px'); // 設定文字大小為 30px

        // 滑鼠移動到選單項目時改變顏色
        li.mouseOver(() => li.style('background', '#d4a373'));
        li.mouseOut(() => li.style('background', '#4f772d'));

        // 如果是 "首頁"，使用嵌入式 iframe
        if (item === '首頁') {
            li.mousePressed(() => {
                createIframe('https://www.tku.edu.tw/');
            });
        }

        // 如果是 "測驗卷"，使用嵌入式 iframe
        if (item === '測驗卷') {
            li.mousePressed(() => {
                createIframe('https://xt9411.github.io/20250310/');
            });
        }

        // 如果是 "作品集"，加入子選項
        if (item === '作品集') {
            let subUl = createElement('ul');
            subUl.style('list-style', 'none');
            subUl.style('margin', '0');
            subUl.style('padding', '0');
            subUl.style('display', 'none'); // 預設隱藏子選項

            let subItems = [
                { name: '第一周作業', link: 'https://xt9411.github.io/20250303/' },
                { name: '第二周作業', link: 'https://xt9411.github.io/20250310/' },
                { name: '第三周作業', link: 'https://xt9411.github.io/20250317/' },
                { name: '第四周作業', link: 'https://xt9411.github.io/20250324/' }
            ];

            for (let subItem of subItems) {
                let subLi = createElement('li', subItem.name);
                subLi.style('padding', '8px 16px');
                subLi.style('margin', '10px 0');
                subLi.style('background', '#d4a373');
                subLi.style('color', '#ffffff');
                subLi.style('border-radius', '5px');
                subLi.style('cursor', 'pointer');
                subLi.style('font-size', '20px'); // 子選項文字大小

                // 點擊子選項時，顯示 iframe
                subLi.mousePressed(() => {
                    createIframe(subItem.link);
                });

                subUl.child(subLi);
            }

            li.mouseOver(() => {
                subUl.style('display', 'block'); // 顯示子選項
            });

            li.mouseOut(() => {
                subUl.style('display', 'none'); // 隱藏子選項
            });

            li.child(subUl);
        }

        // 如果是 "自我介紹"，顯示方塊和文字
        if (item === '自我介紹') {
            li.mousePressed(() => {
                showIntroduction = true;
            });
        }

        // 如果是 "教學影片"，使用嵌入式 iframe
        if (item === '教學影片') {
            li.mousePressed(() => {
                createIframe('https://tku365.sharepoint.com/sites/1132_0277/_layouts/15/stream.aspx?id=%2Fsites%2F1132%5F0277%2FShared%20Documents%2FGeneral%2FRecordings%2F%E3%80%8CGeneral%E3%80%8D%E4%B8%AD%E7%9A%84%E6%9C%83%E8%AD%B0%2D20250317%5F092220%2D%E6%9C%83%E8%AD%B0%E9%8C%84%E8%A3%BD%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E35c0d4e5%2D30c6%2D47a3%2D872a%2D85af7d00efa7');
            });
        }

        // 如果是 "筆記"，使用嵌入式 iframe
        if (item === '筆記') {
            li.mousePressed(() => {
                createIframe('https://hackmd.io/@nn8HNOmOTcGYy2MQDnIFYg/rkdV2jgRyl');
            });
        }

        ul.child(li);
    }

    menu.child(ul);

    // 點擊空白處時關閉 iframe
    document.body.addEventListener('click', (event) => {
        let iframe = select('#contentIframe');
        if (iframe && !menu.elt.contains(event.target)) {
            iframe.remove();
        }
    });
}

// 創建嵌入式 iframe 的函式
function createIframe(link) {
    let iframe = select('#contentIframe');
    if (!iframe) {
        iframe = createElement('iframe');
        iframe.id('contentIframe');
        iframe.style('position', 'absolute');
        iframe.style('top', '20%');
        iframe.style('left', '20%');
        iframe.style('width', '60%');
        iframe.style('height', '60%');
        iframe.style('border', '2px solid #4f772d');
        iframe.style('border-radius', '10px');
        iframe.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
        iframe.style('z-index', '1000');
        document.body.appendChild(iframe.elt);
    }
    iframe.attribute('src', link);
}