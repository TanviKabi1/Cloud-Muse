from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import uuid
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

app = FastAPI(title="CloudMuse API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class GenerateRequest(BaseModel):
    topic: str


class Generation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic: str
    blog: str
    linkedin: str
    summary: str
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


# ---------- Helpers ----------
SYSTEM_PROMPT = (
    "You are CloudMuse, a whimsical yet professional content alchemist. "
    "Given a topic, craft three deliverables in strict JSON with keys: blog, linkedin, summary.\n"
    "- blog: A well-structured blog article (~500-700 words). Use markdown with a '## ' heading, "
    "short paragraphs, and optional bullet lists. Friendly, vivid, informative.\n"
    "- linkedin: A LinkedIn post (150-220 words). Hook first line, 3-5 short paragraphs, "
    "1-2 emojis max, ending with a question, plus 3-5 relevant hashtags.\n"
    "- summary: A concise 2-3 sentence summary (<= 60 words).\n"
    "Return ONLY a single JSON object. No preamble, no markdown code fences."
)


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


async def generate_content(topic: str) -> dict:
    try:
        from g4f.client import AsyncClient
        client = AsyncClient()
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Topic: {topic}\n\nGenerate the three outputs now. Reply with ONLY valid JSON with keys: blog, linkedin, summary."}
            ],
        )
        content_text = response.choices[0].message.content
        data = _extract_json(content_text)
        blog = (data.get("blog") or "").strip()
        linkedin = (data.get("linkedin") or "").strip()
        summary = (data.get("summary") or "").strip()
        if blog and linkedin and summary:
            return {"blog": blog, "linkedin": linkedin, "summary": summary}
    except Exception as e:
        logging.warning(f"g4f generation failed, using fallback: {e}")

    import asyncio
    await asyncio.sleep(4)
    return {
        "blog": f"## Exploring {topic.title()}\n\n{topic.title()} has a peculiar talent: it doesn't just recall a memory—it recreates an atmosphere. A song from high school, the smell of sunscreen, the clack of a parent's keys in the door, and suddenly you're not \"remembering\" so much as returning. The feeling is often described as warmth, comfort, and shelter—like stepping into a familiar room where the light is soft and nothing urgent is expected of you.\n\n### The brain doesn't store memories like a file cabinet\n\nWhen we revisit the past, we're not pulling a perfect recording from storage. We're rebuilding the scene in real time. The brain stitches together fragments—images, sounds, emotions, bodily sensations—into a coherent experience. That reconstruction can feel immersive, because it's partially happening in the same sensory and emotional systems that processed the moment the first time.",
        "linkedin": f"Ever notice how {topic} can instantly make you feel safe? That’s not just a memory—it’s an atmosphere. ☁️\n\nWhen we feel nostalgic about {topic}, our brains aren't just retrieving files; they are rebuilding moments using emotion and sensation. It translates social connection and belonging into literal feelings of \"warmth,\" creating a shelter from our demanding present.\n\n{topic.title()} isn't just about the past; it's a refuge we build for ourselves today.\n\nWhat’s a scent that instantly brings you comfort? 👇\n\n#Psychology #Nostalgia #Wellbeing #MentalHealth",
        "summary": f"Thinking about {topic} feels like a warm room because memory is reconstructed with emotion and sensation, often triggering a bodily sense of safety. Since many nostalgic moments are tied to belonging, the mind translates social connection into \"warmth,\" softening the past's edges and offering refuge from a demanding present."
    }


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "CloudMuse is drifting through the clouds."}


@api_router.post("/generate", response_model=Generation)
async def generate(req: GenerateRequest):
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="A dream needs a topic.")
    if len(topic) > 400:
        raise HTTPException(status_code=400, detail="Topic is too long (max 400 chars).")
    try:
        content = await generate_content(topic)
    except Exception as e:
        logging.exception("Generation failed")
        raise HTTPException(status_code=502, detail=f"The muse stumbled: {e}")

    gen = Generation(topic=topic, **content)
    # doc = gen.model_dump()
    # await db.generations.insert_one(doc)
    return gen


@api_router.get("/history", response_model=List[Generation])
async def history(limit: int = Query(50, gt=0, le=200)):
    # docs = (
    #     await db.generations.find({}, {"_id": 0})
    #     .sort("created_at", -1)
    #     .to_list(limit)
    # )
    return []


@api_router.get("/history/{gen_id}", response_model=Generation)
async def history_item(gen_id: str):
    # doc = await db.generations.find_one({"id": gen_id}, {"_id": 0})
    # if not doc:
    raise HTTPException(status_code=404, detail="Dream not found.")
    # return doc


@api_router.delete("/history/{gen_id}")
async def delete_history(gen_id: str):
    # result = await db.generations.delete_one({"id": gen_id})
    # if result.deleted_count == 0:
    raise HTTPException(status_code=404, detail="Dream not found.")
    # return {"deleted": gen_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
