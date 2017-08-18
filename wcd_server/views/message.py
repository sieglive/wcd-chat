# coding:utf-8
"""Views' Module of Message."""
from hashlib import md5
from uuid import uuid1 as uuid
from datetime import datetime
import time

from tornado.gen import coroutine
from tornado.web import asynchronous

from base_handler import BaseHandler


class Message(BaseHandler):
    """Handler message stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(2)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_json_arguments(['start'])
        if not args.end:
            args.add('end', int(time.time()))

        msg_list = self.message_list.find({
            'msg_time': {
                '$gt': args.start,
                '$lt': args.end
            }
        }).sort('msg_time', -1)

        msg_list = [msg for msg in msg_list]
        for msg in msg_list:
            msg['_id'] = str(msg['_id'])

        res = dict(result=1, status=0, msg='successfully.', data=msg_list)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def post(self, *_args, **_kwargs):
        pass

    @asynchronous
    @coroutine
    def put(self, *_args, **_kwargs):
        res = self.check_auth(2)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_json_arguments(['message'])

        self.message_list.insert_one({
            'msg_id': uuid().hex,
            'message': args.message,
            'msg_time': int(time.time()),
            'date': datetime.utcnow(),
            'nickname': _params.nickname
        })
        res = dict(result=1, status=0, msg='successfully.', data=None)
        self.finish_with_json(res)


MESSAGE_URLS = [
    (r'/message', Message),
]