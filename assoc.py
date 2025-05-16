from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
import json
import os

app = FastAPI()

# Path to the JSON file
STUDENTS_FILE = "students.json"

# Pydantic model for marks
class Marks(BaseModel):
    phy: float
    chem: float
    bio: float

# Pydantic model for student
class Student(BaseModel):
    id: str
    name: str
    sex: str
    age: int
    class_: str  # Using class_ to avoid Python keyword conflict
    marks: Marks

# Pydantic model for student creation/update (no id, as it's generated)
class StudentCreate(BaseModel):
    name: str
    sex: str
    age: int
    class_: str
    marks: Marks

# Initialize JSON file with sample data if it doesn't exist
def initialize_students_file():
    if not os.path.exists(STUDENTS_FILE):
        initial_data = [
            {
                "id": str(uuid4()),
                "name": "John Doe",
                "sex": "male",
                "age": 16,
                "class": "10",
                "marks": {"phy": 85, "chem": 90, "bio": 88}
            },
            {
                "id": str(uuid4()),
                "name": "Jane Smith",
                "sex": "female",
                "age": 17,
                "class": "11",
                "marks": {"phy": 78, "chem": 82, "bio": 80}
            }
        ]
        with open(STUDENTS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)

# Read students from JSON file
def read_students():
    try:
        with open(STUDENTS_FILE, 'r') as f:
            data = json.load(f)
        # Convert to list of Student objects
        return [Student(**student) for student in data]
    except (FileNotFoundError, json.JSONDecodeError):
        initialize_students_file()
        return read_students()

# Write students to JSON file
def write_students(students: List[Student]):
    try:
        with open(STUDENTS_FILE, 'w') as f:
            # Convert Student objects to dict for JSON serialization
            json.dump([student.dict() for student in students], f, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write to file: {str(e)}")

# Initialize the JSON file on startup
initialize_students_file()

# GET endpoint to fetch students with optional filters
@app.get("/school/students", response_model=List[Student])
async def get_students(sex: Optional[str] = "", age: Optional[int] = None, class_: Optional[str] = ""):
    students = read_students()

    # Apply filters if provided
    filtered_students = students
    if sex:
        filtered_students = [s for s in filtered_students if s.sex.lower() == sex.lower()]
    if age is not None:
        filtered_students = [s for s in filtered_students if s.age == age]
    if class_:
        filtered_students = [s for s in filtered_students if s.class_ == class_]

    return filtered_students

# POST endpoint to create a new student
@app.post("/school/students", response_model=Student)
async def create_student(student: StudentCreate):
    students = read_students()
    
    new_student = Student(
        id=str(uuid4()),
        name=student.name,
        sex=student.sex,
        age=student.age,
        class_=student.class_,
        marks=student.marks
    )
    students.append(new_student)
    
    # Save updated students list to JSON file
    write_students(students)
    
    return new_student
