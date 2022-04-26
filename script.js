const filters = document.querySelector('.filters');
const inputs = document.querySelectorAll('input[type="range"]');
const fileInput = document.querySelector('input[type="file"]');
const reset = document.querySelector('.btn-reset');
const nextPicture = document.querySelector('.btn-next');
const savePicture = document.querySelector('.btn-save');
const btn = document.querySelector('.btn-container');
const btnKeys = document.querySelectorAll('.btn');
const image = document.querySelector('.editor img');
const canvas = document.createElement('canvas');
const fullscreen = document.querySelector('.fullscreen');
const baseNight =
  'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/night/';
const baseDay =
  'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/day/';
const baseEvening =
  'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/';
const baseMorning =
  'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/morning/';
const images = [
  '01.jpg',
  '02.jpg',
  '03.jpg',
  '05.jpg',
  '06.jpg',
  '07.jpg',
  '08.jpg',
  '09.jpg',
  '10.jpg',
  '11.jpg',
  '12.jpg',
  '13.jpg',
  '14.jpg',
  '15.jpg',
  '16.jpg',
  '17.jpg',
  '18.jpg',
  '19.jpg',
  '20.jpg',
];
let i = 0;
let date = new Date();

//filters
function setProperties(event) {
  event.target.nextElementSibling.innerHTML = event.target.value;
  document.documentElement.style.setProperty(
    `--${event.target.name}`,
    `${event.target.value}${event.target.dataset.sizing}`
  );
}

//RESET

function resetFilters(event) {
  inputs.forEach((input) => {
    if (input.name == 'saturate') {
      input.value = 100;
      input.nextElementSibling.innerHTML = input.value;
      document.documentElement.style.setProperty(
        `--${input.name}`,
        `${input.value}${input.dataset.sizing}`
      );
    } else {
      input.value = 0;
      input.nextElementSibling.innerHTML = input.value;
      document.documentElement.style.setProperty(
        `--${input.name}`,
        `${input.value}${input.dataset.sizing}`
      );
    }
  });
}

//Next Picture
function viewBgImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = src;
  };
}
function getImage(event) {
  let imageSrc;
  const index = i % images.length;
  if (date.getHours() >= 6 && date.getHours() < 12) {
    imageSrc = baseMorning + images[index];
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    imageSrc = baseDay + images[index];
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    imageSrc = baseEvening + images[index];
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    imageSrc = baseNight + images[index];
  }
  viewBgImage(imageSrc);
  i++;
  btnKeys.disabled = true;
  setTimeout(function () {
    btnKeys.disabled = false;
  }, 1000);
}

//Load Picture
fileInput.addEventListener('change', function (e) {
  const file = fileInput.files[0];
  const reader = new FileReader();
  console.log(reader);
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
  fileInput.value = '';
});

//Save Picture
function drawImage() {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    const coeff =
      canvas.width / image.width > canvas.height / image.height
        ? canvas.width / image.width
        : canvas.height / image.height;
    ctx.filter = `blur(${coeff * inputs[0].value}px) invert(${
      inputs[1].value
    }%) sepia(${inputs[2].value}%) saturate(${inputs[3].value}%) hue-rotate(${
      inputs[4].value
    }deg)`;
    ctx.drawImage(img, 0, 0);
    downloadImage();
  };
}
function downloadImage() {
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

//button animation

btn.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) {
    if (!event.target.classList.contains('btn-active')) {
      const elem = btn.querySelector('.btn-active');

      elem.classList.remove('btn-active');
      event.target.classList.add('btn-active');
      if (event.target.classList.contains('btn-load--input')) {
        event.target.parentElement.classList.add('btn-active');
      }
    }
  }
});

//Fullscreen
fullscreen.addEventListener('click', (event) => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

filters.addEventListener('input', setProperties);
reset.addEventListener('click', resetFilters);
nextPicture.addEventListener('click', getImage);
savePicture.addEventListener('click', drawImage);
