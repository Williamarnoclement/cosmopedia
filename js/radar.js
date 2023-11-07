const max = document.getElementById('radar-max'); 
const min = document.getElementById('radar-min'); 


function foo () {
    const minNumber = Math.floor(Math.random() * 878676) + 1;
    let maxNumber = minNumber + Math.floor(Math.random() * 100) + 1;
    max.textContent = 'between 1.' + minNumber + 'f and 1.' + maxNumber + 'f';
}


setInterval(foo, 1000);