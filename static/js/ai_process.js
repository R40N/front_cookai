const imageUploadForm = document.getElementById('image-upload-form');
const resultDiv = document.getElementById('result');
const spinner = document.getElementById('spinner');

imageUploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const imageFile = document.getElementById('image-file').files[0];

  // API 주소 및 API 키
  const apiUrl = 'https://detect.roboflow.com/cookai/3';
  const apiKey = '6IsE8q93pI9yjgK2CwxG';

  // 이미지 처리 동안 로딩 스피너를 표시
  spinner.style.display = 'block';

  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(apiUrl + '?api_key=' + apiKey, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      displayResults(data); // 결과를 처리하고 표시하는 함수
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function displayResults(data) {
  // 원하는 HTML 요소에 이미지와 결과 표시
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // 사용자가 업로드한 원본 이미지를 그림
  const imageURL = URL.createObjectURL(document.getElementById('image-file').files[0]);
  const image = new Image();
 image.src = imageURL;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    // 경계 상자를 이미지 위에 그림
    data.predictions.forEach(prediction => {
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.strokeRect(
        prediction.x * image.width,
        prediction.y * image.height,
        prediction.width * image.width,
        prediction.height * image.height
      );
    });

    // 이미지 처리 완료 후 로딩 스피너 숨김
    spinner.style.display = 'none';

    resultDiv.innerHTML = '';
    resultDiv.appendChild(canvas);
  };
}
