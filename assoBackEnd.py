from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import uuid
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configure CORS to allow requests from Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JSON file path
JSON_FILE = "associations.json"

# Pydantic models for request/response validation
class Activity(BaseModel):
    activity_name: str
    roles: List[str]

class Association(BaseModel):
    association_id: str
    club_name: str
    activities: List[Activity]
    no_of_activities: int

class AssociationsResponse(BaseModel):
    associations: List[Association]
    no_of_associations: int

class AssociationCreate(BaseModel):
    club_name: str
    activities: List[Activity]
    no_of_activities: int

# Initialize JSON file if it doesn't exist
def initialize_json_file():
    if not os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'w') as f:
            json.dump({}, f)

# Read associations from JSON file
def read_associations():
    initialize_json_file()
    with open(JSON_FILE, 'r') as f:
        return json.load(f)

# Write associations to JSON file
def write_associations(data):
    with open(JSON_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# GET endpoint to retrieve associations for a user
@app.get("/associations/{user_id}", response_model=AssociationsResponse)
async def get_associations(user_id: str):
    data = read_associations()
    user_data = data.get(user_id, {"associations": [], "no_of_associations": 0})
    return AssociationsResponse(**user_data)

# POST endpoint to add a new association for a user
@app.post("/associations/{user_id}", response_model=AssociationsResponse)
async def create_association(user_id: str, association: AssociationCreate):
    data = read_associations()
    
    # Initialize user data if not exists
    if user_id not in data:
        data[user_id] = {"associations": [], "no_of_associations": 0}
    
    # Create new association with a unique ID
    new_association = association.dict()
    new_association["association_id"] = str(uuid.uuid4())
    
    # Append new association and update count
    data[user_id]["associations"].append(new_association)
    data[user_id]["no_of_associations"] = len(data[user_id]["associations"])
    
    # Write updated data to file
    write_associations(data)
    
    return AssociationsResponse(**data[user_id])
