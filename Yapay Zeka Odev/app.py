from flask import Flask, request, jsonify, render_template
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
import processing  # processing.py'den fonksiyonları import ediyoruz

app = Flask(__name__)

# Helper function to decode base64 image
def decode_base64_image(data_url):
    img_data = base64.b64decode(data_url.split(',')[1])
    img = Image.open(BytesIO(img_data))
    img = np.array(img)
    return cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_image():
    data = request.get_json()

    if not data or 'image' not in data or 'operation' not in data:
        return jsonify({"error": "No image or operation specified"}), 400

    image_data = data['image']
    operation = data['operation']

    # Decode base64 image
    image = decode_base64_image(image_data)

    # Perform selected operation
    if operation == 'grayscale':
        processed_image = processing.convert_to_grayscale(image)
    elif operation == 'blur':
        processed_image = processing.blur_image(image)
    elif operation == 'canny':
        processed_image = processing.canny_edge_detection(image)
    elif operation == 'harris':
        processed_image = processing.harris_corner_detection(image)
    elif operation == 'contour':
        processed_image = processing.contour_detection(image)
    else:
        return jsonify({"error": "Invalid operation"}), 400

    # Convert processed image back to base64
    _, buffer = cv2.imencode('.png', processed_image)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')

    # Return both the original and processed images
    return jsonify({
        "original": image_data,
        "processed": f"data:image/png;base64,{processed_image_base64}"
    })

if __name__ == '__main__':
    app.run(debug=True)
