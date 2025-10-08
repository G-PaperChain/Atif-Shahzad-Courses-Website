from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.Course import Course
from app.models.User import User
from app.models.Quiz import Quiz
from app.models.QuizMark import QuizMark
from app.services.utils import admin_required
import requests
ORCID_ID = "0000-0003-2058-3648"
BASE_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}"
HEADERS = {"Accept": "application/json"}

about_bp = Blueprint('about', __name__)

@about_bp.route("/orcid/researches", methods=["GET"])
def get_works():
    url = f"{BASE_URL}/works"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        return jsonify({
            "success" : False,
            "error": "Failed to fetch researches",
            "status": response.status_code,
            })

    data = response.json()

    # Extract useful info
    works = []
    for group in data.get("group", []):
        summary = group["work-summary"][0]
        works.append({
            "title": summary["title"]["title"]["value"],
            "type": summary["type"],
            "put-code": summary["put-code"],
            "year": summary.get("publication-date", {}).get("year", {}).get("value"),
            "journal": summary.get("journal-title", {}).get("value"),
            "doi": next(
                (id["value"] for id in summary.get("external-ids", {}).get("external-id", [])
                 if id["external-id-type"] == "doi"),
                None
            )
        })

    return jsonify(
        {
            "success" : True,
            "researches" : works,
        })

@about_bp.route("/orcid/researche/<put_code>", methods=["GET"])
def get_single_work(put_code):
    url = f"{BASE_URL}/work/{put_code}"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch work", "status": response.status_code})

    return jsonify(response.json())