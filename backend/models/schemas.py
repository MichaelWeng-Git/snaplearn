from pydantic import BaseModel


class ImageAnalysis(BaseModel):
    extracted_text: str
    subject: str
    topic: str
    subtopic: str
    difficulty_level: str
    confidence: float


class PracticeExercise(BaseModel):
    question: str
    hint: str


class StudyRecommendation(BaseModel):
    key_concepts: list[str]
    explanation: str
    recommended_resources: list[str]
    practice_exercises: list[PracticeExercise]
    study_path: list[str]
    common_mistakes: list[str]


class AnalyzeResponse(BaseModel):
    extracted_text: str
    subject: str
    topic: str
    subtopic: str
    difficulty_level: str
    confidence: float
    key_concepts: list[str]
    explanation: str
    recommended_resources: list[str]
    practice_exercises: list[PracticeExercise]
    study_path: list[str]
    common_mistakes: list[str]
