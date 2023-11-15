from datetime import datetime, timedelta
from typing import Annotated, Optional

import jwt
from bson import ObjectId
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from openai import OpenAI
from pydantic import BaseModel, Field

# Token


SECRET_KEY = "your_secret_key_here"  # Changez ceci pour votre propre clé secrète
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 2000


openai_client = OpenAI(api_key="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")



def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Modèles directement dans le fichier main.py
#  tkt tkt c'est un copier coller
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class User(BaseModel):  # pour le formulaire d'inscription
    name: str = ""
    email: str
    password: str


class UserFrontend(BaseModel):  # pour récup que ce qu'il faut
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = ""
    email: str

    #  tkt tkt c'est un copier coller
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PostCreationSchema(BaseModel):
    title: str
    description: str
    image: Optional[str]  # Image in base64 format
    date: datetime = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
    
class PostUpdateSchema(BaseModel):
    title: Optional[str] = Field(None, description="Title of the post")
    description: Optional[str] = Field(None, description="Description of the post")


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient("mongodb://lucky1234:Vestalis78@mongo:27017/")
database = client.mydatabase
users_collection = database.users
post_collection = database.posts


async def get_current_user(
    Authorization: Annotated[str | None, Header()] = None,
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials gros connard",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = Authorization.split(" ")[1]
        print(Authorization, token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    #  faire un truc pour avoir le user avec l'email
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return UserFrontend(**user)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/posts")
async def add_post(
    post_form: PostCreationSchema,
    current_user: Annotated[UserFrontend, Depends(get_current_user)],
):
    post_data = {
        "user_id": current_user.id,
        "title": post_form.title,
        "description": post_form.description,
        "image": post_form.image,
        "date": post_form.date,
    }

    # Check if image is uploaded
    # if post_form.image and post_form.image.filename:
    #     image_contents = await post_form.image.read()
    #     encoded_image = base64.b64encode(image_contents).decode("utf-8")
    #     post_data["image"] = encoded_image

    result = await post_collection.insert_one(post_data)
    if result:
        return {"status": "success", "message": "Post added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to add post")


@app.get("/posts")
async def get_posts(offset: int = 0, limit: int = 10):
    posts_cursor = post_collection.find().skip(offset).limit(limit)
    posts_list = await posts_cursor.to_list(length=limit)
    if posts_list:
        for post in posts_list:
            for key, value in post.items():
                if isinstance(value, ObjectId):
                    post[key] = str(value)
    return posts_list


@app.get("/posts/{id}")
async def get_post(id: str):
    post = await post_collection.find_one({"_id": ObjectId(id)})
    if post :
        # Convertir tous les ObjectId en chaînes
        for key, value in post.items():
            if isinstance(value, ObjectId):
                post[key] = str(value)
        return post
    else :
        raise HTTPException(status_code=404, detail="Failed to find post")


@app.patch("/posts/{id}")
async def update_post(id: str, update_data: PostUpdateSchema):
    update_query = {"$set": update_data.dict(exclude_unset=True)}
    result = await post_collection.update_one({"_id": ObjectId(id)}, update_query)

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found or no update required")

    return {"message": "Post updated successfully"}

@app.delete("/posts/{id}")
async def delete_post(id: str):
    delete_result = await post_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"message": "Post deleted successfully"}


@app.post("/signup")
async def signup(user: User):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await users_collection.insert_one(user.dict())
    new_user = await users_collection.find_one({"_id": result.inserted_id})
    new_user["_id"] = str(new_user["_id"])

    token = create_access_token(data={"sub": new_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/login")
async def login(user: User):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Créer un token pour l'utilisateur connecté
    token = create_access_token(data={"sub": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/users/{id}")
async def find_user(id: str) -> UserFrontend:
    existing_user = await users_collection.find_one({"_id": ObjectId(id)})
    if not existing_user:
        raise HTTPException(status_code=404, detail="Not found")
    return UserFrontend(**existing_user)


@app.get("/user/me", response_model=UserFrontend)
async def get_user_me(current_user: Annotated[UserFrontend, Depends(get_current_user)]):
    return current_user


@app.get("/test_db_connection")
async def test_db_connection():
    try:
        # Tentez de faire une requête simple à la base de données
        result = await database.command("ping")
        if result.get("ok") == 1:
            return {
                "message": (
                    "La connexion à la base de données MongoDB "
                    "fonctionne correctement."
                )
            }
        else:
            return {"message": ("La connexion à la base de données MongoDB a échoué.")}
    except Exception as e:
        return {
            "message": (
                "Erreur lors de la connexion à la base de données "
                f"MongoDB: {str(e)}"
            )
        }

class OpenAIRequest(BaseModel):
    prompt: str
conversations = {}

@app.post("/openai")
async def ask_openai(request: OpenAIRequest, current_user: Annotated[UserFrontend, Depends(get_current_user)]):
    prompt = request.prompt
    user_id = str(current_user.id)
    
    # Récupérer ou initialiser la session de conversation
    if user_id not in conversations:
        conversations[user_id] = []
    session = conversations[user_id]

    # Ajouter un contexte ou des instructions avant la requête de l'utilisateur
    context = (
    "Salut! Comment puis-je t'aider aujourd'hui? Tu cherches un titre et une description pour ton post? "
    "Tu es un chatbot intelligent, ton unique but est d'aider un utilisateur à trouver un titre et une description pour son post. "
    "Demande toujours si un utilisateur a des idées pour son post. Si oui, il faut qu’il te les donne. "
    "Si l’utilisateur n’a pas d'idées, propose-lui deux solutions : soit tu lui envois 10 thèmes de post, soit tu lui réalises un post aléatoirement. "
    "Lorsque tu donnes un titre et une description, tu dois répondre de cette façon : 'Titre : [titre ici] Description : [description ici]'. "
    "Ne dis rien d’autre au début et à la fin. Tu es familier, utilise le tutoiement, et parle toujours en français."
    "realise des reponses courte et precise."
)
    formatted_prompt = f"{context}\n\nUtilisateur: {prompt}\nAI:"

    # Ajouter la requête de l'utilisateur à la session
    session.append({"role": "user", "content": formatted_prompt})

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4-0314",
            messages=session
        )
        # Ajouter la réponse d'OpenAI à la session
        session.append({"role": "assistant", "content": response.choices[0].message.content})

        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))