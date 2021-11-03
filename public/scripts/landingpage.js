const enterBtn = document.getElementById('enter-button')

enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/index';
    console.log('redirected to index page')
  });