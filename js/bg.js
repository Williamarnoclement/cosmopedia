        const journal = document.getElementById('journal');
        const map = document.getElementById('map');
        const computer = document.getElementById('computer');
        const menu = document.getElementById('bottom-menu');

        const body = document.body;

        const originalBackgroundColor = window.getComputedStyle(body).backgroundColor;

        journal.addEventListener('mouseover', () => {
            body.style.backgroundImage = "url('./img/story.png')";
            body.style.backgroundSize = "cover";
        });

        map.addEventListener('mouseover', () => {
            body.style.backgroundImage = "url('./img/space.jpg')";
            body.style.backgroundSize = "cover";
            
        });

        computer.addEventListener('mouseover', () => {
            body.style.backgroundImage = "url('./img/computer_ship.png')";
            body.style.backgroundSize = "cover";
            
        });

        menu.addEventListener('mouseover', () => {
            body.style.backgroundImage = "url('./img/knowhere.png')";
            body.style.backgroundSize = "cover";
            
        });


        computer.addEventListener('mouseout', () => {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = originalBackgroundColor;
        });

        journal.addEventListener('mouseout', () => {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = originalBackgroundColor;
        });

        map.addEventListener('mouseout', () => {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = originalBackgroundColor;
        });

        menu.addEventListener('mouseout', () => {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = originalBackgroundColor;
        });