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
pages = Jinja2Templates(directory="pages")
app.mount("/static", StaticFiles(directory="static"), name="static")
# app.mount("/font", StaticFiles(directory="font"), name="font")

@app.get("/")
async def home(request: Request):
  return pages.TemplateResponse("home.html", {"request": request})

@app.get("/index")
async def index(request: Request):
  return pages.TemplateResponse("index.html", {"request": request})

@app.get("/about")
async def about(request: Request):
  return pages.TemplateResponse("about.html", {"request": request})

@app.get("/second")
async def second(request: Request):
  return pages.TemplateResponse("second.html", {"request": request})

@app.get("/user1")
async def user1(request: Request):
  return pages.TemplateResponse("user1.html", {"request": request})

@app.get("/user2")
async def user2(request: Request):
  return pages.TemplateResponse("user2.html", {"request": request})

@app.get("/user3")
async def user3(request: Request):
  return pages.TemplateResponse("user3.html", {"request": request})
