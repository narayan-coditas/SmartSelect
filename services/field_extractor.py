import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_fields(text: str) -> dict:
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        temperature=0.4,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert resume parser. Extract the following fields from the resume: "
                    "name, email, education (list), skills (list), experience (list), and professionalDetails (list). "
                    "Always respond with valid JSON only, no explanation. Here is an example format:\n\n"
                    "{\n"
                    "  \"name\": \"Jane Doe\",\n"
                    "  \"email\": \"jane.doe@example.com\",\n"
                    "  \"education\": [\"B.Tech in Computer Science, IIT Delhi\"],\n"
                    "  \"skills\": [\"Python\", \"Machine Learning\", \"SQL\"],\n"
                    "  \"experience\": [\"Software Engineer at Infosys (2020-2022)\"],\n"
                    "  \"professionalDetails\": [\"Worked on NLP pipelines\", \"Contributed to AI models\"]\n"
                    "}\n"
                    "Now extract the same from the following resume:"
                )
            },
            {
                "role": "user",
                "content": text
            }
        ]
    )

    raw_response = response.choices[0].message.content.strip()
    try:
        return json.loads(raw_response)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned from LLM:\n{raw_response}")
