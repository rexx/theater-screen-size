document.addEventListener('DOMContentLoaded', () => {
    const screens = [
        { name: "國立海洋科技博物館", type: "8K投影機", sound: "", width: 29, height: 22 },
        { name: "台北美麗華大直", type: "IMAX(雷射)", sound: "IMAX 12.1", width: 28.4, height: 21.2 },
        { name: "台北國賓大戲院", type: "鉅院廳(雷射)", sound: "Dolby Atmos", width: 22, height: 12 },
        { name: "台北松仁威秀", type: "TITAN(雷射)", sound: "Dolby 7.1", width: 22, height: 12 },
        { name: "新北新店裕隆城威秀", type: "IMAX(雷射)", sound: "", width: 21.4, height: 11.6 },
        { name: "新北板橋大遠百威秀", type: "IMAX(雷射)", sound: "", width: 21.3, height: 11.5 },
        { name: "台北樂聲", type: "巨幕廳(雷射)", sound: "Dolby 7.1", width: 20, height: 10 },
        { name: "台北西門in89", type: "LUXE", sound: "Dolby 7.1", width: 19.3, height: 8.3 },
        { name: "台北美麗華大直", type: "Dolby Cinema", sound: "Dolby Atmos", width: 14.8, height: 7 }
    ];

    const screenContainer = document.getElementById('screen-container');
    const screenList = document.getElementById('screen-list');

    screens.forEach((screen, index) => {
        const screenBox = document.createElement('div');
        screenBox.className = 'screen-box';
        screenBox.id = `screen-box-${index + 1}`;
        screenContainer.appendChild(screenBox);
        screen.element = screenBox;

        const listItem = document.createElement('div');
        listItem.className = 'screen-list-item showing';
        listItem.textContent = screen.name;
        listItem.addEventListener('click', () => {
            const isShowing = screen.element.style.display !== 'none';
            screen.element.style.display = isShowing ? 'none' : 'block';
            listItem.className = `screen-list-item ${isShowing ? 'hiding' : 'showing'}`;
            recalculateScreenSizes();
        });
        listItem.addEventListener('mouseover', () => {
            screens.forEach(s => {
                if (s !== screen) {
                    s.element.style.opacity = '0.2';
                }
            });
        });
        listItem.addEventListener('mouseout', () => {
            screens.forEach(s => {
                s.element.style.opacity = '1';
            });
        });
        screenList.appendChild(listItem);
        screen.listItem = listItem;
    });

    function recalculateScreenSizes() {
        const visibleScreens = screens.filter(screen => screen.element.style.display !== 'none');
        const maxScreen = visibleScreens.reduce((max, screen) => {
            const screenArea = screen.width * screen.height;
            return screenArea > max.width * max.height ? screen : max;
        }, visibleScreens[0]);

        const scaleFactor = Math.min(window.innerWidth / (maxScreen.width * 10), window.innerHeight / (maxScreen.height * 10)) * 0.9;
        const borderWidth = 2; // Border width in pixels

        visibleScreens.forEach(screen => {
            const area = screen.width * screen.height;
            screen.element.style.width = `${screen.width * scaleFactor * 10}px`; // Adjust width based on scale factor
            screen.element.style.height = `${screen.height * scaleFactor * 10}px`; // Adjust height based on scale factor
            screen.element.style.position = 'absolute';
            if (screen === maxScreen) {
                screen.element.style.top = '50%';
                screen.element.style.left = '50%';
                screen.element.style.transform = 'translate(-50%, -50%)';
            } else {
                screen.element.style.top = `calc(50% + ${(maxScreen.height * scaleFactor * 10 / 2) - (screen.height * scaleFactor * 10) - borderWidth}px)`;
                screen.element.style.left = '50%';
                screen.element.style.transform = 'translateX(-50%)';
            }
            screen.element.innerHTML = `
                <div class="screen-text">
                    <div>${screen.name}</div>
                    <div>${screen.width}m × ${screen.height}m = ${Math.round(area * 100) / 100}m²</div>
                </div>
            `;
        });
    }

    recalculateScreenSizes();

    // Show all screens
    document.getElementById('show-all').addEventListener('click', () => {
        screens.forEach(screen => {
            screen.element.style.display = 'block';
            screen.listItem.className = 'screen-list-item showing';
        });
        recalculateScreenSizes();
    });

    // Hide all screens
    document.getElementById('hide-all').addEventListener('click', () => {
        screens.forEach(screen => {
            screen.element.style.display = 'none';
            screen.listItem.className = 'screen-list-item hiding';
        });
    });
});
