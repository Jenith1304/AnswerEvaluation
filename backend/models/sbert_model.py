import torch
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load SBERT model (Optimized for Sentence Similarity)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def get_embedding(text):
    """Generate sentence embedding using SBERT."""
    embedding = model.encode(text, convert_to_numpy=True)

    # Normalize for better similarity comparison
    return embedding / np.linalg.norm(embedding)

def evaluate_answer(reference_answer, student_answer):
    """Compute similarity between reference and student answers."""
    ref_embedding = get_embedding(reference_answer)
    stud_embedding = get_embedding(student_answer)
    
    similarity = cosine_similarity([ref_embedding], [stud_embedding])[0][0]
    
    print(f"Reference Answer: {reference_answer}")
    print(f"Student Answer: {student_answer}")
    print(f"Similarity Score: {similarity}")
    
    return similarity

def assign_marks(similarity_score):
    """Assign marks based on similarity score."""
    if similarity_score >= 0.85:
        return "Full Marks (Excellent Answer)"
    elif similarity_score >= 0.65:
        return "High Marks (Good Answer)"
    elif similarity_score >= 0.45:
        return "Partial Marks (Acceptable Answer)"
    else:
        return "Low Marks (Needs Improvement)"
