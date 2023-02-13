from typing import List
import numpy as np
import  cv2
import ipfshttpclient
import codecs, json
import uvicorn
from fastapi import Body, FastAPI, UploadFile,status,File,HTTPException,Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from fastapi.middleware.cors import CORSMiddleware

from db import user_collection,reports_collection
from database.models import User,Reports

from model.unet_model import Unet


app = FastAPI()

model = None
api = None

origins = [
    # "http://10.20.129.24",
    # "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"Enjoy": "It's Working"}

@app.get("/setup")
def setup():
    global model,api
    try:
        api = ipfshttpclient.connect("/ip4/10.1.41.158/tcp/5001")
    except ipfshttpclient.exceptions.ConnectionError as ce:
        print(str(ce))
    model = Unet()
    return {"status" : "Setup Done"}

@app.post("/register",response_description="Add new user",response_model=User)
async def register(user:User = Body(...)):
    data = jsonable_encoder(user)
    registered = await user_collection.insert_one(data)
    registered_user =await user_collection.find_one({"_id": registered.inserted_id})
    return registered_user

@app.get("/allUsers",response_model=List[User])
async def predict():
    registered_user =await user_collection.find({}).to_list(1000)
    users = []
    for i in registered_user:
        users.append(User(**i))
    return users

@app.get("/getUser/{wallet}",response_model_include=User)
async def findUser(wallet:str,response:Response):
    if(user := await user_collection.find_one({"wallet":wallet})) is not None:
        response.status_code = status.HTTP_200_OK
        return  User(**user)
    response.status_code = status.HTTP_404_NOT_FOUND
    return HTTPException(status_code=404, detail=f"wallet {wallet} not found")

@app.get("/getUserId/{id}",response_model=User)
async def getReport(id:str,response:Response):
    if(user := await user_collection.find_one({"_id":id})) is not None:
        response.status_code = status.HTTP_200_OK
        return User(**user)
    response.status_code = status.HTTP_404_NOT_FOUND
    return HTTPException(status_code=404,detail="User {id} Not found")

@app.post("/uploadMRI",response_description="Upload Image")
async def uploadMRI(file: UploadFile=File(...)):
    """Image will be uploaded and model will perform actions then it will send to distributed file system and retrive url for it"""
    image =  cv2.imdecode(np.frombuffer(await file.read(),np.uint8),cv2.IMREAD_COLOR)
    cv2.imwrite("images/1.tif",image)
    global model,api
    mask = model.predict(image)
    mask = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    cv2.imwrite("images/mask.jpg",mask)
    file_url = api.add("images/1.tif")
    mask_url = api.add("images/mask.jpg")    
    return {
        "scan":file_url,
        "mask":mask_url
    }

@app.post("/uploadReport",response_description="Upload Brain MRI and create objects",response_model=Reports)
async def createReports(reports:Reports = Body(...)):
    data = jsonable_encoder(reports)
    print(data)
    report = await reports_collection.insert_one(data)
    report = await reports_collection.find_one({"_id": report.inserted_id})
    return report

@app.get("/getAllReports")
async def getReport():
    reports =await reports_collection.find({}).to_list(1000)
    data = []
    for i in reports:
        data.append(Reports(**i))
    return data

@app.post("/uploadRx",response_description="Return Updated contract address",response_class=Reports)
async def uploadRx():
    """New Rx will added by doctor and we will update contract"""
    pass

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, debug=True,reload=True)    