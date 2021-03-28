document.querySelector('#postsList').style.display = 'none';
document.querySelector('#load').classList.add('loader');
setTimeout(() => {
    document.querySelector('#load').classList.remove('center');
    document.querySelector('#load').style.display = 'none';
    document.querySelector('#postsList').style.display = 'flex';
}, 500);