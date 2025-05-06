from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
limiter = Limiter(key_func=get_remote_address)
jwt = JWTManager()