class StudentUpdate(BaseModel):
    rollnumber: str
    name: Optional[str] = None
    maths: Optional[int] = None
    physics: Optional[int] = None
    bio: Optional[int] = None

@app.put("/update-student")
def update_student(data: StudentUpdate):
    if not os.path.exists(DATA_FILE):
        raise HTTPException(status_code=500, detail="Data file not found")

    with open(DATA_FILE, 'r') as file:
        students = json.load(file)

    updated = False
    for student in students:
        if student["rollnumber"] == data.rollnumber:
            if data.name is not None:
                student["name"] = data.name
            if data.maths is not None:
                student["maths"] = data.maths
            if data.physics is not None:
                student["physics"] = data.physics
            if data.bio is not None:
                student["bio"] = data.bio
            updated = True
            break

    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")

    with open(DATA_FILE, 'w') as file:
        json.dump(students, file, indent=2)

    return {"message": "Student data updated successfully"}
