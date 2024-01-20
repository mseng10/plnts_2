from flask import Flask, request, jsonify
from flask_cors import CORS  # For handling cross-origin requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

plants = [
    {"id": 1, "name": "Snake Plant", "type": "Indoor", "wateringFrequency": "Once a week"},
    {"id": 2, "name": "Rose", "type": "Outdoor", "wateringFrequency": "Twice a week"}
    # Add more plant data as needed
]
@app.route('/plants', methods=['GET'])
def get_plants():
    return jsonify(plants)

@app.route('/plants', methods=['POST'])
def add_plant():
    new_plant = request.get_json()
    new_plant['id'] = len(plants) + 1
    plants.append(new_plant)
    return jsonify(new_plant), 201

if __name__ == '__main__':
    app.run(debug=True)
