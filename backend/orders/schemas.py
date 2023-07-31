from datetime import date
from ninja import Schema
from datetime import datetime, time
from typing import Optional
from typing import List,Dict,Any
from .models import OrderStatus
from enum import Enum

class Status(str,Enum):
    UP='U'
    DOWN='D'


class TopCustomerSchema(Schema):
    client_name: str
    client_email: str
    client_phone: str
    total: int

class OrdersSales(Schema):
    orders:int
    sales:float

class DiffSchema(Schema):
    status:Status
    value:float
    percent:float

class DashboardSchema(Schema):
    total_orders: int
    total_sales: str
    yesterday: OrdersSales
    today: OrdersSales
    diff: Dict[str,DiffSchema]
    top_customers: List[TopCustomerSchema]

class OrderItemSchema(Schema):
    quantity: int
    name: str
    price: float
    qty_x_price: float


class OrderSchema(Schema):
    order_no: str
    order_type: str
    order_status: str
    order_datetime: datetime
    pickup_date: date
    pickup_time: time
    payment_paid: bool
    payment_method: str
    transaction_id: str
    transaction_amount: float
    client_name: str
    client_address: str
    client_phone: str
    client_email: str
    order_sub_total: float
    order_tax: float
    order_tip: float
    order_total: float
    order_items: List[OrderItemSchema]
    payment_remarks: Optional[str]



class UpdateOrderStatusIn(Schema):
    order_no: str
    order_status: OrderStatus


class UpdateOrderStatusOut(Schema):
    status_ok: bool
    order_no: str
    updated_status: OrderStatus
    message: str
