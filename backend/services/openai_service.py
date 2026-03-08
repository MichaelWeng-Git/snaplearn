import base64
import os

from dotenv import load_dotenv
from openai import OpenAI

from models.schemas import ImageAnalysis, StudyRecommendation

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_image(image_bytes: bytes, content_type: str) -> ImageAnalysis:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:{content_type};base64,{base64_image}"

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert educational content analyzer. "
                    "Given an image of a homework problem, exam question, or study material, "
                    "extract the text exactly as written and classify it.\n\n"
                    "For difficulty_level, use one of: elementary, middle_school, high_school, undergraduate, graduate.\n"
                    "For confidence, rate 0.0–1.0 how confident you are in the classification.\n"
                    "If the image is unreadable or not educational content, set confidence below 0.3 "
                    "and extracted_text to a description of what you see."
                ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url},
                    },
                    {
                        "type": "text",
                        "text": "Analyze this image. Extract the text and classify the subject, topic, subtopic, and difficulty level.",
                    },
                ],
            },
        ],
        response_format=ImageAnalysis,
    )

    return completion.choices[0].message.parsed


def generate_recommendations(analysis: ImageAnalysis) -> StudyRecommendation:
    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert tutor and study coach. "
                    "Given information about a homework or exam question, generate comprehensive, "
                    "actionable study recommendations.\n\n"
                    "Provide:\n"
                    "- key_concepts: the core concepts the student needs to understand\n"
                    "- explanation: a clear, concise explanation of the topic at the appropriate difficulty level\n"
                    "- recommended_resources: specific textbooks, chapters, websites, or videos (use real, well-known resources)\n"
                    "- practice_exercises: 3–5 practice problems with hints, similar in style but not identical\n"
                    "- study_path: ordered steps the student should follow to master this topic\n"
                    "- common_mistakes: mistakes students typically make on this type of problem"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Subject: {analysis.subject}\n"
                    f"Topic: {analysis.topic}\n"
                    f"Subtopic: {analysis.subtopic}\n"
                    f"Difficulty: {analysis.difficulty_level}\n\n"
                    f"Question text:\n{analysis.extracted_text}"
                ),
            },
        ],
        response_format=StudyRecommendation,
    )

    return completion.choices[0].message.parsed
