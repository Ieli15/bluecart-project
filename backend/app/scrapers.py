# app/services/scraper.py

import requests

HEADERS = {
    "x-rapidapi-key": "2374fda9eamsh7033f5704f50dd6p1292ddjsnc77b6f8ca300"
}

def fetch_amazon(query):
    url = "https://real-time-amazon-data.p.rapidapi.com/search"
    params = {"query": query, "page": "1"}
    headers = {**HEADERS, "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"}
    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200: return []
    products = res.json().get("data", {}).get("products", [])
    return [{
        "name": p.get("title"),
        "shop": "Amazon",
        "price": float(p.get("price", {}).get("raw", "0").replace("$", "")),
        "rating": float(p.get("rating", 0)),
        "rating_count": int(p.get("ratings_total", 0)),
        "delivery_cost": 10.0,
        "payment_mode": "Pay after delivery"
    } for p in products[:5]]

def fetch_ebay(query):
    url = "https://real-time-ebay-data.p.rapidapi.com/search"
    params = {"query": query}
    headers = {**HEADERS, "x-rapidapi-host": "real-time-ebay-data.p.rapidapi.com"}
    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200: return []
    products = res.json().get("products", [])
    return [{
        "name": p.get("title"),
        "shop": "eBay",
        "price": float(p.get("price", {}).get("value", 0)),
        "rating": float(p.get("rating", 0)),
        "rating_count": int(p.get("rating_count", 0)),
        "delivery_cost": 15.0,
        "payment_mode": "Pay before delivery"
    } for p in products[:5]]

def fetch_walmart(query):
    url = "https://walmart-data.p.rapidapi.com/search"
    params = {"query": query}
    headers = {**HEADERS, "x-rapidapi-host": "walmart-data.p.rapidapi.com"}
    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200: return []
    products = res.json().get("data", [])
    return [{
        "name": p.get("title"),
        "shop": "Walmart",
        "price": float(p.get("price", {}).get("price", 0)),
        "rating": float(p.get("rating", {}).get("overallRating", 0)),
        "rating_count": int(p.get("rating", {}).get("ratingCount", 0)),
        "delivery_cost": 7.0,
        "payment_mode": "Pay after delivery"
    } for p in products[:5]]

def fetch_aliexpress(query):
    url = "https://aliexpress-datahub.p.rapidapi.com/item_search"
    params = {"q": query, "page": "1"}
    headers = {**HEADERS, "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com"}
    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200: return []
    products = res.json().get("data", {}).get("items", [])
    return [{
        "name": p.get("title"),
        "shop": "AliExpress",
        "price": float(p.get("price", 0)),
        "rating": float(p.get("rating", 0)),
        "rating_count": int(p.get("ratings_total", 0)),
        "delivery_cost": 5.0,
        "payment_mode": "Pay before delivery"
    } for p in products[:5]]

def scrape_all_sites(query):
    return fetch_amazon(query) + fetch_ebay(query) + fetch_walmart(query) + fetch_aliexpress(query)