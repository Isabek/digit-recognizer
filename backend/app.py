import base64
import re

from flask import Flask, jsonify
from flask import request
from flask_cors import cross_origin

app = Flask(__name__)

@app.route('/api/v1/recognize', methods=['POST'])
@cross_origin(allow_headers=['Content-Type', "Access-Control-Allow-Credentials"])
def recognize():
    image_data = re.sub('^data:image/.+;base64,', '', request.form['image'])
    image_data = base64.b64decode(image_data)
    with open("temp.png", 'wb') as f:
        f.write(image_data)
    return jsonify({'message': "Image has been successfully uploaded"})


if __name__ == "__main__":
    app.run(port=8080, debug=True)
