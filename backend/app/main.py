import base64
from datetime import datetime, timedelta
from typing import Annotated, Optional

# Token
import jwt
from bson import ObjectId
from fastapi import (Depends, FastAPI, File, Header, HTTPException, UploadFile,
                     status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

SECRET_KEY = "your_secret_key_here"  # Changez ceci pour votre propre clé secrète
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string')


class User(BaseModel):  # pour le formulaire d'inscription
    name: str = ''
    email: str
    password: str


class UserFrontend(BaseModel):  # pour récup que ce qu'il faut
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    name: str = ''
    email: str

#  tkt tkt c'est un copier coller
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Post(BaseModel):
    user_id: PyObjectId
    title: str
    description: str
    image: Optional[str]  # Image in base64 format


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
collection = database.users
post_collection = database.posts


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/addPost")
async def add_post(
    user_id: PyObjectId,
    title: str,
    description: str,
    image: Optional[UploadFile] = File(None)
):
    post_data = {
        "user_id": user_id,
        "title": title,
        "description": description
    }

    # Check if image is uploaded
    if image and image.filename:
        image_contents = await image.read()
        encoded_image = base64.b64encode(image_contents).decode("utf-8")
        post_data["image"] = encoded_image

    result = await post_collection.insert_one(post_data)
    if result:
        return {"status": "success", "message": "Post added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to add post")


@app.get("/getPosts")
async def get_posts():
    posts_cursor = post_collection.find()
    # Récupère les 100 premiers posts, ajustez selon vos besoins
    posts_list = await posts_cursor.to_list(length=100)

    # Convertir tous les ObjectId en chaînes
    for post in posts_list:
        for key, value in post.items():
            if isinstance(value, ObjectId):
                post[key] = str(value)

    return posts_list


@app.post("/signup")
async def signup(user: User):
    print("Début de la fonction signup")
    existing_user = await collection.find_one({"email": user.email})
    print(f"Utilisateur existant : {existing_user}")
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await collection.insert_one(user.dict())
    print(f"Résultat de l'insertion : {result}")
    new_user = await collection.find_one({"_id": result.inserted_id})
    print(f"Nouvel utilisateur : {new_user}")
    new_user["_id"] = str(new_user["_id"])

    token = create_access_token(data={"sub": new_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/login")
async def login(user: User):
    db_user = await collection.find_one({"email": user.email})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Créer un token pour l'utilisateur connecté
    token = create_access_token(data={"sub": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/find-user/{id}")
async def find_user(id: str) -> UserFrontend:
    existing_user = await collection.find_one({"_id": ObjectId(id)})
    if not existing_user:
        raise HTTPException(status_code=404, detail="Not found")
    return UserFrontend(**existing_user)


async def get_current_user(Authorization: Annotated[str | None, Header()] = None):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials gros connard",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = Authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    #  faire un truc pour avoir le user avec l'email
    user = await collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return UserFrontend(**user)


@app.get("/user/me", response_model=UserFrontend)
async def read_own_items(
    current_user: Annotated[UserFrontend, Depends(get_current_user)]
):
    return current_user


@app.get("/test_db_connection")
async def test_db_connection():
    try:
        # Tentez de faire une requête simple à la base de données
        result = await database.command("ping")
        if result.get("ok") == 1:
            return {
                "message": (
                    "La connexion à la base de données "
                    + "MongoDB fonctionne correctement."
                )
            }
        else:
            return {"message": ("La connexion à la base de données MongoDB a échoué.")}
    except Exception as e:
        return {
            "message": (
                "Erreur lors de la connexion à la base de données "
                + f"MongoDB : {str(e)}"
            )
        }
