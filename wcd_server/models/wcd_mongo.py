# coding:utf-8
"""Predefination of mongo schema."""

from pymongo import MongoClient

from config import CFG as config

M_CLIENT = MongoClient(config.mongo.client).__getattr__(config.mongo.db)

SESSION = M_CLIENT.session