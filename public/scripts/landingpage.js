const enterBtn = document.getElementById('enter-button')

enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/notes';
    console.log('redirected to notes page')
  });