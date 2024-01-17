from flask import Flask, request, jsonify
import requests
import uuid
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def forward_request():
    try:
        # Get the uploaded files from the request
        json_file = request.files['json_data']
        image_file = request.files['image']

        uid = str(uuid.uuid4())
        extension = os.path.splitext(json_file.filename)[1]
        img_ext = os.path.splitext(image_file.filename)[1]
        json_key = f'{uid}{extension}'
        image_key = f'{uid}{img_ext}'

        # Save the files with the generated keys
        json_file.save(os.path.join('uploads', json_key))
        image_file.save(os.path.join('uploads', image_key))

        # Specify the file paths
        image_file_path = f'uploads/{image_key}'
        json_file_path = f'uploads/{json_key}'

        # Specify the target URL
        target_url = 'http://103.4.146.170:8090/api/run-sd/'

        # Create a dictionary of files to send in the request
        files = {
            'image': open(image_file_path, 'rb'),
            'json_data': open(json_file_path, 'rb'),
        }

        # Make a POST request to the target URL with files attached
        response = requests.post(target_url, files=files)
        os.remove(image_file_path)
        os.remove(json_file_path)

        # Return the response from the other server
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="5005")
