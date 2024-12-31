document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');
    const captureButton = document.getElementById('capture');
    const uploadButton = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file');
    const applyOperationButton = document.getElementById('apply-operation');
    const operationSelect = document.getElementById('operation-select');
    const inputSelect = document.getElementById('input-select'); // Yeni eklenen element

    let currentImageData = null; // Yüklenen veya çekilen son resim burada saklanacak

    // Kamera Akışını Başlat
    navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 400 } }) // Kameradan çözünürlük isteği
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Kamera açılırken bir hata oluştu: ', error);
        });

    // İlk açılışta "Dosya Yükle" seçeneğini aktif yap
    document.getElementById('video-container').style.display = 'none';
    captureButton.style.display = 'none';
    fileInput.style.display = 'inline-block';
    uploadButton.style.display = 'inline-block';

    // Fotoğraf Çekme
    captureButton.addEventListener('click', () => {
        const context = canvas.getContext('2d');

        // Sabit boyut ayarı (örneğin, 640x480)
        const fixedWidth = 640;
        const fixedHeight = 480;

        canvas.width = fixedWidth;
        canvas.height = fixedHeight;

        // Görüntüyü sabit çözünürlüğe göre çiz
        context.drawImage(video, 0, 0, fixedWidth, fixedHeight);
        currentImageData = canvas.toDataURL('image/png');  // Kameradan alınan görüntü
        applyImageProcessing(currentImageData);  // Bu görüntüye işlem uygula
        showToast('Fotoğraf başarıyla çekildi!');
    });

    // Resim Yükleme
    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageData = e.target.result;  // Yüklenen dosyanın base64 kodu
                applyImageProcessing(currentImageData);  // Bu görüntüye işlem uygula
                showToast('Resim başarıyla yüklendi!');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Lütfen bir resim seçin.');
        }
    });

    // Fotoğraf Yükleme Seçimi
    inputSelect.addEventListener('change', (event) => {
        const selection = event.target.value;

        if (selection === 'camera') {
            document.getElementById('video-container').style.display = 'block';
            captureButton.style.display = 'inline-block';
            fileInput.style.display = 'none';
            uploadButton.style.display = 'none';
        } else {
            document.getElementById('video-container').style.display = 'none';
            captureButton.style.display = 'none';
            fileInput.style.display = 'inline-block';
            uploadButton.style.display = 'inline-block';
        }
    });

    // Görüntü İşleme
    applyOperationButton.addEventListener('click', () => {
        const selectedOperation = operationSelect.value;

        if (currentImageData) {  // Eğer geçerli bir resim varsa
            applyImageProcessing(currentImageData, selectedOperation);  // Seçilen işlemi uygula
            
            // Sonuç sekmesine geçiş yap
            const resultTab = new bootstrap.Tab(document.getElementById('pills-result-tab'));
            resultTab.show();
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

    // Toast gösterme fonksiyonu
    function showToast(message) {
        const toastElement = new bootstrap.Toast(document.getElementById('toast'));
        document.querySelector('.toast-body').textContent = message;
        toastElement.show();
    }
});
