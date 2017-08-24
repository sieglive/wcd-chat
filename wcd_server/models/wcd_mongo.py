# coding:utf-8
"""Predefination of mongo schema."""

from pymongo import MongoClient

from config import CFG as config

M_CLIENT = MongoClient(config.mongo.client).__getattr__(config.mongo.db)

MESSAGE_LIST = M_CLIENT.message_list
MESSAGE_LIST.create_index('user_id')
MESSAGE_LIST.ensure_index("date", expireAfterSeconds=3600)

WCD_USER = M_CLIENT.wcd_user
WCD_USER.create_index('user_id')
WCD_USER.create_index('nickname')
WCD_USER.create_index('user_time')

SESSION = M_CLIENT.session
