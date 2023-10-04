from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import numpy as np

app = Flask(__name__)
model = None

# Load the trained model
def load_trained_model():
    global model
    model = load_model('final_x_ray_model.h5')

# Preprocess the uploaded image
# Preprocess the uploaded image
# Preprocess the uploaded image
def preprocess_image(image, target_size=(150, 150)):
    # Convert the image to a NumPy array
    image_array = np.frombuffer(image.read(), np.uint8)

    # Decode the image array to OpenCV format
    cv_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Resize the image to the target size
    resized_image = cv2.resize(cv_image, target_size)

    # Normalize the image pixel values to the range [0, 1]
    normalized_image = resized_image / 255.0

    # Return the preprocessed image
    return normalized_image


# Define the route for image upload and prediction
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Get the uploaded image file
        image = request.files['image']

        # Preprocess the image
        processed_image = preprocess_image(image)

        # Perform prediction using the loaded model
        prediction = model.predict(np.expand_dims(processed_image, axis=0))

        # Map the prediction to the corresponding label
        predicted_class = 'Pneumonia' if prediction > 0.5 else 'Normal'

        # Return the prediction result as JSON
        return jsonify({'prediction': predicted_class})

# Define the route for the home page
@app.route('/')
def home():
    return render_template('htmlcode.html')

if __name__ == '__main__':
    # Load the trained model
    load_trained_model()

    # Start the Flask server
    app.run()
