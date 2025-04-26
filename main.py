# main.py
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi import Request
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/hello")
async def hello():
  return {"message": "Hello, FastAPI!"}

# main.py に追記

# テンプレートと静的ファイルの設定
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/font", StaticFiles(directory="font"), name="font")

@app.get("/")
async def home(request: Request):
  return templates.TemplateResponse("home.html", {"request": request})

@app.get("/index")
async def index(request: Request):
  return templates.TemplateResponse("index.html", {"request": request})

@app.get("/about")
async def about(request: Request):
  return templates.TemplateResponse("about.html", {"request": request})

@app.get("/second")
async def second(request: Request):
  return templates.TemplateResponse("second.html", {"request": request})
