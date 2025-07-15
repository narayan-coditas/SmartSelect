from openai import OpenAI
import os, json, re
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

client = OpenAI(api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1")

def extract_key_skills(skills: str):
    try:
        print("Calling LLM for:", skills)
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            temperature=0.4,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a resume parsing assistant.\n"
                        "You are given a list of general and detailed skills from a resume.\n"
                        "Your task is to extract only the most job-relevant individual skills.\n"
                        "Respond ONLY with a clean, uncategorized, flat JSON array of skill strings.\n\n"
                        "IMPORTANT:\n"
                        "- Do NOT group skills\n"
                        "- Do NOT use categories\n"
                        "- Just list individual skills like: \"Python\", \"Excel\"\n"
                        "- Give me JSON only"
                    ),
                },
                {
                    "role": "user",
                    "content": skills
                },
            ],
        )
        content = response.choices[0].message.content.strip()
        print("Raw response:", content)

        match = re.search(r"\[.*?\]", content, re.DOTALL)
        if match:
            key_skills = json.loads(match.group())
            print("Extracted skills:", key_skills)
            return key_skills
        else:
            print("No JSON array found in response.")
            return []
    except Exception as e:
        print("Error during key_skills extraction:", e)
        return []
