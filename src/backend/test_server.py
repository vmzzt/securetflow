﻿from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Securet Flow SSC DAST Platform - Backend funcionando!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
