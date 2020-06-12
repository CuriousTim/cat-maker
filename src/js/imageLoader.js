self.addEventListener('message', async event => {
  const imgURL = event.data;
  let x = new XMLHttpRequest();
  x.responseType = 'blob';
  x.onload = function () {
    console.log(imgURL);
  }
  x.open('GET', imgURL, true);
  x.send(); 
});
