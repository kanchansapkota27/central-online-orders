# from ninja import NinjaAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI

from orders.api import router

api = NinjaExtraAPI()
api.register_controllers(NinjaJWTDefaultController)
api.add_router("orders", router)
