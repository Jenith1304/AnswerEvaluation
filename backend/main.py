from fastapi import FastAPI
from pydantic import BaseModel
from models.sbert_model import evaluate_answer, assign_marks  # Import SBERT functions

app = FastAPI()

# Define request model
class AnswerRequest(BaseModel):
    reference_answer: str
    student_answer: str

@app.post("/evaluate")
async def evaluate(request: AnswerRequest):
    """API endpoint to evaluate student answers."""
    similarity_score = float(evaluate_answer(request.reference_answer, request.student_answer))
    marks = assign_marks(similarity_score)
    
    return {
        "similarity_score": round(similarity_score, 2),
        "marks": marks
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
