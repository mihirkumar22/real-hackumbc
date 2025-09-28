# server.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
import mediapipe as mp
import cv2
import base64

from flask import Flask, request, jsonify
from flask_cors import CORS  # import CORS

app = Flask(__name__)

# Load model & label encoder
model = joblib.load("modelASL.joblib")
le = joblib.load("leASL.joblib")

# Initialize Mediapipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

app = Flask(__name__)
CORS(app)  # allow all origins by default

# Example route
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    img_b64 = data.get("image")  # base64 string
    if not img_b64:
        return jsonify({"error": "No image provided"}), 400

    # Decode image
    img_bytes = base64.b64decode(img_b64.split(",")[1])
    img_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Run Mediapipe
    results = hands.process(img)
    if not results.multi_hand_landmarks:
        return jsonify({"prediction": None})

    hand_landmarks = results.multi_hand_landmarks[0]
    landmarks = []
    for lm in hand_landmarks.landmark:
        landmarks.extend([lm.x, lm.y, lm.z])
    landmarks = np.array(landmarks).reshape(1, -1)

    # Predict
    pred = model.predict(landmarks)[0]
    letter = le.inverse_transform([pred])[0]

    return jsonify({"prediction": letter})

if __name__ == "__main__":
    app.run(debug=True)
