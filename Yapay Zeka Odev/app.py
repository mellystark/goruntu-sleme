from flask import Flask, request, jsonify, render_template
import base64
import cv2
import numpy as np
from processing import (grayscale, blur, canny, harris, contour, sharpen, 
                        rotate, flip, sepia, threshold, histogram, dilation, erosion)

app = Flask(__name__)

# Ana sayfa rota
@app.route('/')
def home():
    return render_template('index.html')

# Görüntü işleme rota
@app.route('/process', methods=['POST'])
def process_image():
    data = request.json
    image_data = data['image']
    operation = data['operation']

    # Base64 çözme
    nparr = np.frombuffer(base64.b64decode(image_data.split(',')[1]), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # İşlem seçimi
    if operation == 'grayscale':
        processed_img = grayscale(img)
    elif operation == 'blur':
        processed_img = blur(img)
    elif operation == 'canny':
        processed_img = canny(img)
    elif operation == 'harris':
        processed_img = harris(img)
    elif operation == 'contour':
        processed_img = contour(img)
    elif operation == 'sharpen':
        processed_img = sharpen(img)
    elif operation == 'rotate':
        processed_img = rotate(img)
    elif operation == 'flip':
        processed_img = flip(img)
    elif operation == 'sepia':
        processed_img = sepia(img)
    elif operation == 'threshold':
        processed_img = threshold(img)
    elif operation == 'histogram':
        processed_img = histogram(img)
    elif operation == 'dilation':
        processed_img = dilation(img)
    elif operation == 'erosion':
        processed_img = erosion(img)
    else:
        return jsonify({'error': 'Geçersiz işlem'}), 400

    # Base64'e dönüştürme
    _, buffer = cv2.imencode('.png', processed_img)
    processed_image_data = base64.b64encode(buffer).decode('utf-8')

    return jsonify({
        'original': image_data,
        'processed': f"data:image/png;base64,{processed_image_data}"
    })

if __name__ == '__main__':
    app.run(debug=True)
