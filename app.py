from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from face_engine import biometric_engine

app = FastAPI(
    title=\"Smart Attendance Face Recognition Microservice\",
    description=\"AI/ML Face Recognition Service for Hacktoberfest by Code Keeda\",
    version=\"1.0.0\"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"*\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

class RegisterFaceRequest(BaseModel):
    student_id: str
    image: str

class RecognizeRequest(BaseModel):
    image: str
    class_student_ids: Optional[List[str]] = None

@app.get(\"/\")
def root():
    return {
        \"service\": \"Smart Curriculum & Attendance Face AI Microservice\",
        \"team\": \"Code Keeda\",
        \"hackathon\": \"Hacktoberfest\",
        \"status\": \"Online\",
        \"endpoints\": [\"/health\", \"/register-face\", \"/recognize\"]
    }

@app.get(\"/health\")
def health_check():
    return {\"status\": \"healthy\", \"biometric_engine\": \"active\", \"version\": \"1.0.0\"}

@app.post(\"/register-face\")
def register_face(payload: RegisterFaceRequest):
    try:
        result = biometric_engine.register_face(payload.student_id, payload.image)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post(\"/recognize\")
def recognize(payload: RecognizeRequest):
    try:
        result = biometric_engine.recognize_faces(payload.image, payload.class_student_ids)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == \"__main__\":
    import uvicorn
    uvicorn.run(\"app:app\", host=\"0.0.0.0\", port=8000, reload=True)
