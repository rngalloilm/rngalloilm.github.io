 /*
  * Open the drawer when the menu ison is clicked.
  */
 let menuToggle = document.querySelector('#menuToggle');
 let main = document.querySelector('main');
 let drawer = document.querySelector('#drawer');

 menuToggle.addEventListener('click', function (e) {
   drawer.classList.toggle('open');
   e.stopPropagation();
 });
 main.addEventListener('click', function () {
   drawer.classList.remove('open');
 });
