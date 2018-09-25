import base64
import io
import re

import numpy as np

from PIL import Image
from flask import Flask, jsonify
from flask import request
from flask_cors import cross_origin
from keras.models import load_model
from keras.preprocessing.image import img_to_array

app = Flask(__name__)

model = None

MODEL_PATH = 'models/mnist.h5'


def load_keras_model():
    global model
    model = load_model(MODEL_PATH)


def prepare_image(image, target):
    if image.mode != "L":
        image = image.convert("L")
    image = image.resize(target)
    image = img_to_array(image)
    image = image.reshape(1, target[0], target[1], 1).astype('float32')
    return image


@app.route('/api/v1/recognize', methods=['POST'])
@cross_origin(allow_headers=['Content-Type', "Access-Control-Allow-Credentials"])
def recognize():
    image_data = re.sub('^data:image/.+;base64,', '', request.form['image'])
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data))
    image = prepare_image(image, target=(28, 28))
    result = model.predict(image)
    return jsonify({'message': "Image has been successfully uploaded"})


if __name__ == "__main__":
    load_keras_model()
    app.run(port=8080, debug=False, threaded=False)
