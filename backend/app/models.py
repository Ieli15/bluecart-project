from datetime import datetime
from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import event
from email_validator import validate_email, EmailNotValidError
import re

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    searches = db.relationship('SearchHistory', back_populates='user', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if kwargs.get('password'):
            self.set_password(kwargs['password'])

    def set_password(self, password):
        if not self.validate_password(password):
            raise ValueError("Password doesn't meet complexity requirements")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def validate_password(password):
        """Password must have:
        - 8+ characters
        - 1 uppercase
        - 1 lowercase
        - 1 number
        - 1 special character
        """
        if len(password) < 8:
            return False
        if not re.search(r"[A-Z]", password):
            return False
        if not re.search(r"[a-z]", password):
            return False
        if not re.search(r"[0-9]", password):
            return False
        if not re.search(r"[^A-Za-z0-9]", password):
            return False
        return True

    @staticmethod
    def validate_email(email):
        try:
            validate_email(email)
            return True
        except EmailNotValidError:
            return False

class SearchHistory(db.Model):
    __tablename__ = 'search_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    query = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    results = db.relationship('ProductAnalysis', back_populates='search', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='searches')

    def __repr__(self):
        return f'<Search {self.query[:20]}...>'

def calculate_marginal_benefit(rating, delivery_cost, payment_mode):
    """Calculate Marginal Benefit (MB)"""
    rating_score = (rating / 5) * 0.6 if rating else 0
    delivery_score = max(0, (1 - (delivery_cost / 100))) * 0.3 if delivery_cost is not None else 0.3
    payment_score = 0.1 if payment_mode == 'Pay after delivery' else 0.05
    return round(rating_score + delivery_score + payment_score, 4)

def calculate_cost_benefit(price, delivery_cost, rating):
    """Calculate Cost Benefit (CB)"""
    total_cost = price + (delivery_cost or 0)
    if total_cost <= 0:
        return 0
    return round((rating * 100) / total_cost, 4)

class ProductAnalysis(db.Model):
    __tablename__ = 'product_analysis'

    id = db.Column(db.Integer, primary_key=True)
    search_id = db.Column(db.Integer, db.ForeignKey('search_history.id'), nullable=False)
    product_id = db.Column(db.String(100), nullable=False)  # Unique ID from source
    product_name = db.Column(db.String(255), nullable=False)
    shop_name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    rating = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    delivery_cost = db.Column(db.Float, default=0.0)
    delivery_time = db.Column(db.String(50))
    payment_mode = db.Column(db.String(50))
    product_url = db.Column(db.String(512))
    image_url = db.Column(db.String(512))
    marginal_benefit = db.Column(db.Float)
    cost_benefit = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    search = db.relationship('SearchHistory', back_populates='results')

    def calculate_metrics(self):
        """Calculate Marginal Benefit and Cost Benefit"""
        self.marginal_benefit = calculate_marginal_benefit(self.rating, self.delivery_cost, self.payment_mode)
        self.cost_benefit = calculate_cost_benefit(self.price, self.delivery_cost, self.rating)

# Indexes for better query performance
event.listen(User.__table__, 'after_create', 
             db.DDL('CREATE INDEX idx_user_email ON users (email)'))
event.listen(SearchHistory.__table__, 'after_create',
             db.DDL('CREATE INDEX idx_search_user ON search_history (user_id)'))
event.listen(ProductAnalysis.__table__, 'after_create',
             db.DDL('CREATE INDEX idx_product_search ON product_analysis (search_id)'))
