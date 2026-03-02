from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "P2P Login Prototype API"}

@app.get("/status")
async def status():
    return {"status": "online"}
