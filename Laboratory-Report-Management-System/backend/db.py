import os
import motor.motor_asyncio

MONGO_DETAILS = os.environ.get("MONGODB_URL")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.god
user_collection = database.get_collection("user")
reports_collection = database.get_collection("reports")