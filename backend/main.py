# from fastapi import FastAPI
# from pydantic import BaseModel
# from models.sbert_model import evaluate_answer, assign_marks  # Import SBERT functions

# app = FastAPI()

# # Define request model
# class AnswerRequest(BaseModel):
#     reference_answer: str
#     student_answer: str

# @app.post("/evaluate")
# async def evaluate(request: AnswerRequest):
#     """API endpoint to evaluate student answers."""
#     similarity_score = float(evaluate_answer(request.reference_answer, request.student_answer))
#     marks = assign_marks(similarity_score)
    
#     return {
#         "similarity_score": round(similarity_score, 2),
#         "marks": marks
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=4000)

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from models.sbert_model import evaluate_answer, assign_marks

app = FastAPI()

# Request model
class AnswerItem(BaseModel):
    referenceAnswer: str
    studentAnswer: str
    marks: float

@app.post("/evaluate")
async def evaluate_batch(request: List[AnswerItem]):
    response = []

    for item in request:
        similarity_score = float(evaluate_answer(item.referenceAnswer, item.studentAnswer))
        feedback = assign_marks(similarity_score)
        marks_obtained = round(similarity_score * item.marks, 2)

        response.append({
            "similarity_score": round(similarity_score, 2),
            "marks_obtained":round( marks_obtained),
            "feedback": feedback
        })

    return response
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
