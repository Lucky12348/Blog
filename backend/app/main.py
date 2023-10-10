from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

# Modèles directement dans le fichier main.py
class User(BaseModel):
    email: str
    password: str

class UserInDB(User):
    _id: str

app = FastAPI()

client = AsyncIOMotorClient("mongodb://lucky1234:Vestalis78@mongo:27017/")
database = client.mydatabase
collection = database.users

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/signup")
async def signup(user: User):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    result = await collection.insert_one(user.dict())
    new_user = await collection.find_one({"_id": result.inserted_id})
    return new_user

@app.post("/login")
async def login(user: User):
    db_user = await collection.find_one({"email": user.email})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"message": f"Welcome {db_user['email']}!"}

@app.get("/test_db_connection")
async def test_db_connection():
    try:
        # Tentez de faire une requête simple à la base de données
        result = await database.command("ping")
        if result.get("ok") == 1:
            return {"message": "La connexion à la base de données MongoDB fonctionne correctement."}
        else:
            return {"message": "La connexion à la base de données MongoDB a échoué."}
    except Exception as e:
        return {"message": f"Erreur lors de la connexion à la base de données MongoDB : {str(e)}"}

