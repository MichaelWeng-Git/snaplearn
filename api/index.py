import base64
import os
import traceback

import httpx
import jwt
from jwt import PyJWKClient

from fastapi import FastAPI, HTTPException, UploadFile, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# --- Clerk auth config ---

CLERK_ISSUER = os.environ.get("CLERK_ISSUER", "")
_jwks_client = PyJWKClient(f"{CLERK_ISSUER}/.well-known/jwks.json") if CLERK_ISSUER else None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic models ---

class ImageAnalysis(BaseModel):
    extracted_text: str
    subject: str
    topic: str
    subtopic: str
    difficulty_level: str
    confidence: float


class PracticeExercise(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str


class Resource(BaseModel):
    name: str
    url: str


class StudyRecommendation(BaseModel):
    solution: str
    key_concepts: list[str]
    explanation: str
    recommended_resources: list[Resource]
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
    solution: str
    key_concepts: list[str]
    explanation: str
    recommended_resources: list[Resource]
    practice_exercises: list[PracticeExercise]
    study_path: list[str]
    common_mistakes: list[str]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: str = ""


class TopicSummary(BaseModel):
    subject: str
    topic: str
    subtopic: str
    difficulty_level: str


class RecommendRequest(BaseModel):
    topics: list[TopicSummary]


class RecommendResponse(BaseModel):
    exercises: list[PracticeExercise]
    summary: str


# --- Auth helper ---


def verify_token(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    if not _jwks_client:
        raise HTTPException(status_code=500, detail=f"Auth not configured. CLERK_ISSUER={'set' if CLERK_ISSUER else 'missing'}")
    token = authorization.split(" ", 1)[1]
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return {"user_id": payload["sub"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {type(e).__name__}: {e}")


# --- Endpoints ---

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/debug")
async def debug():
    """Test outbound connectivity and OpenAI auth."""
    results = {}

    # Test basic outbound HTTPS
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("https://httpbin.org/get", timeout=10.0)
            results["httpbin"] = f"OK ({r.status_code})"
    except Exception as e:
        results["httpbin"] = f"FAIL: {type(e).__name__}: {e}"

    # Test OpenAI reachability
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("https://api.openai.com/v1/models", headers={
                "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY', 'missing')}"
            }, timeout=10.0)
            results["openai_models"] = f"OK ({r.status_code})"
    except Exception as e:
        results["openai_models"] = f"FAIL: {type(e).__name__}: {e}"

    # Test OpenAI SDK
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"], timeout=15.0)
        r = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say hi"}],
            max_tokens=5,
        )
        results["openai_sdk"] = f"OK: {r.choices[0].message.content}"
    except Exception as e:
        results["openai_sdk"] = f"FAIL: {type(e).__name__}: {e}\n{traceback.format_exc()}"

    results["key_prefix"] = os.environ.get("OPENAI_API_KEY", "missing")[:12] + "..."
    return results


@app.post("/api/analyze")
async def analyze(file: UploadFile, user: dict = Depends(verify_token)):
    from openai import AsyncOpenAI

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WebP, GIF.")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10 MB.")

    client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"], timeout=55.0)

    try:
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:{file.content_type};base64,{base64_image}"

        completion = await client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert educational content analyzer. "
                        "Given an image of a homework problem, exam question, or study material, "
                        "extract the text exactly as written and classify it.\n\n"
                        "For difficulty_level, be as specific as possible. Use one of: "
                        "Pre-K, Kindergarten, Grade 1, Grade 2, Grade 3, Grade 4, Grade 5, Grade 6, "
                        "Grade 7, Grade 8, Grade 9, Grade 10, Grade 11, Grade 12, "
                        "Undergraduate Year 1, Undergraduate Year 2, Undergraduate Year 3, Undergraduate Year 4, "
                        "Graduate, Postgraduate. "
                        "Analyze the complexity, vocabulary, and concepts to determine the most accurate grade level.\n"
                        "For confidence, rate 0.0-1.0 how confident you are in the classification.\n"
                        "If the image is unreadable or not educational content, set confidence below 0.3 "
                        "and extracted_text to a description of what you see."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": data_url}},
                        {"type": "text", "text": "Analyze this image. Extract the text and classify the subject, topic, subtopic, and difficulty level."},
                    ],
                },
            ],
            response_format=ImageAnalysis,
        )
        analysis = completion.choices[0].message.parsed
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI vision analysis failed: {type(e).__name__}: {e}")

    if analysis.confidence < 0.3:
        raise HTTPException(status_code=422, detail="Could not confidently identify educational content in this image. Please try a clearer photo.")

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert tutor and study coach. "
                        "Given information about a homework or exam question, generate comprehensive, "
                        "actionable study recommendations.\n\n"
                        "Provide:\n"
                        "- solution: if the extracted text contains a specific question or problem, provide the correct answer "
                        "with a clear step-by-step solution. If it is general study material with no specific question, set this to an empty string.\n"
                        "- key_concepts: the core concepts the student needs to understand\n"
                        "- explanation: a clear, concise explanation of the topic at the appropriate difficulty level\n"
                        "- recommended_resources: each resource must have a 'name' (descriptive title) and 'url' (a real, working link). "
                        "Use well-known educational platforms like Khan Academy, Coursera, MIT OpenCourseWare, YouTube (specific videos), "
                        "Paul's Online Math Notes, Organic Chemistry Tutor, CK-12, Purplemath, etc. Every URL must be a real, valid link.\n"
                        "- practice_exercises: 3-5 multiple-choice practice problems. Each must have a 'question', "
                        "exactly 4 'options' (labeled A, B, C, D in the text), 'correct_answer' (the full text of the correct option), "
                        "and 'explanation' (why the correct answer is right). Questions should be similar in style but not identical to the original.\n"
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
        recommendations = completion.choices[0].message.parsed
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI recommendation generation failed: {type(e).__name__}: {e}")

    return AnalyzeResponse(**analysis.model_dump(), **recommendations.model_dump())


@app.post("/api/recommend")
async def recommend(body: RecommendRequest, user: dict = Depends(verify_token)):
    from openai import AsyncOpenAI

    if not body.topics:
        raise HTTPException(status_code=400, detail="No study history to generate recommendations from.")

    seen = set()
    unique_topics = []
    for t in body.topics:
        key = (t.subject, t.topic, t.subtopic)
        if key not in seen:
            seen.add(key)
            unique_topics.append(t)
        if len(unique_topics) >= 10:
            break

    topic_lines = "\n".join(
        f"- {t.subject} > {t.topic} > {t.subtopic} ({t.difficulty_level})"
        for t in unique_topics
    )

    client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"], timeout=30.0)

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert tutor. Given a list of topics a student has recently studied, "
                        "generate 5 new practice multiple-choice questions that span their studied areas. "
                        "Questions should reinforce learning and test understanding across the topics. "
                        "Each question must have exactly 4 options, a correct_answer "
                        "(the full text of the correct option), and an explanation. "
                        "Also provide a short 1-sentence 'summary' describing what the questions cover. "
                        "Make questions diverse - cover different topics from the list rather than "
                        "focusing on just one."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Here are the topics I've been studying:\n{topic_lines}",
                },
            ],
            response_format=RecommendResponse,
        )
        return completion.choices[0].message.parsed
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Recommendation generation failed: {type(e).__name__}: {e}")


@app.post("/api/chat")
async def chat(body: ChatRequest, user: dict = Depends(verify_token)):
    from openai import AsyncOpenAI

    system_content = (
        "You are a friendly, expert tutor. Answer clearly and concisely at the "
        "student's level. Use examples when helpful. If the student asks you to "
        "generate practice problems, include answers. Keep responses focused and under 300 words."
    )
    if body.context:
        system_content += f"\n\nContext about what the student is studying:\n{body.context}"

    messages = [{"role": "system", "content": system_content}]
    for m in body.messages:
        messages.append({"role": m.role, "content": m.content})

    client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"], timeout=30.0)

    try:
        completion = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=1024,
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Chat failed: {type(e).__name__}: {e}")
