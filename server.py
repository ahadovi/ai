from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the POST request has a file part
        if 'file' not in request.files:
            return 'No file part'

        file = request.files['file']

        # If the user does not select a file, the browser submits an empty file without a filename
        if file.filename == '':
            return 'No selected file'

        # Save the file locally
        file.save(f'uploads/{file.filename}')

        return f'File "{file.filename}" uploaded successfully'


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="5005")