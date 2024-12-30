const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const captureButton = document.getElementById('capture');
const uploadButton = document.getElementById('upload-btn');
const fileInput = document.getElementById('file');
const applyOperationButton = document.getElementById('apply-operation');
const operationSelect = document.getElementById('operation-select');

let currentImageData = null; // Yüklenen veya çekilen son resim burada saklanacak

// Kamera Akışını Başlat
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    });

// Fotoğraf Çekme
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    currentImageData = canvas.toDataURL('image/png');  // Kameradan alınan görüntü
    applyImageProcessing(currentImageData);  // Bu görüntüye işlem uygula
});

// Resim Yükleme
uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageData = e.target.result;  // Yüklenen dosyanın base64 kodu
            applyImageProcessing(currentImageData);  // Bu görüntüye işlem uygula
        };
        reader.readAsDataURL(file);
    } else {
        alert('Lütfen bir resim seçin.');
    }
});

// Görüntü İşleme
applyOperationButton.addEventListener('click', () => {
    const selectedOperation = operationSelect.value;

    if (currentImageData) {  // Eğer geçerli bir resim varsa
        applyImageProcessing(currentImageData, selectedOperation);  // Seçilen işlemi uygula
    } else {
        alert('Lütfen bir resim yükleyin veya fotoğraf çekin.');
    }
});

function applyImageProcessing(imageData, operation = 'grayscale') {
    fetch('/process', {
        method: 'POST',
        body: JSON.stringify({ image: imageData, operation: operation }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('original').src = data.original;
        document.getElementById('processed').src = data.processed;
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}
