# coding:utf-8
"""Views' Module of Message."""
from hashlib import md5
from uuid import uuid1 as uuid
from datetime import datetime
import time

from tornado.gen import coroutine
from tornado.web import asynchronous

from base_handler import BaseHandler


class ChatRoom(BaseHandler):
    """Handler message stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_form_arguments([], ['chat_id'])

        if not args.chat_id:
            chat_list = self.chat_list.find({'chat_create_time': {'$gt': 1}})
            chat_list = [chat for chat in chat_list]
            for chat in chat_list:
                if '_id' in chat:
                    del chat['_id']
        else:
            chat_list = self.chat_list.find_one({'chat_id': args.chat_id})
            if '_id' in chat_list:
                del chat_list['_id']

        res = dict(result=1, status=0, msg='Successfully.', data=chat_list)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def post(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

    @asynchronous
    @coroutine
    def put(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_json_arguments(['chat_name'])

        chat_info = dict(
            chat_id=str(uuid()),
            chat_name=args.chat_name,
            creator_ip=_params.user_ip,
            creator_nick=_params.nickname,
            chat_secret=args.chat_secret,
            chat_create_time=int(time.time()),
            chat_member=[
                dict(
                    user_ip=_params.user_ip,
                    nickname=_params.nickname, )
            ])
        self.chat_list.insert_one(chat_info)
        if '_id' in chat_info:
            del chat_info['_id']

        res = dict(result=1, status=0, msg='Successfully.', data=chat_info)
        print(res)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def delete(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_form_arguments(['chat_id'])

        chat_info = self.chat_list.find_one(dict(chat_id=args.chat_id))
        if not chat_info:
            return self.dump_fail_data(3104)
        if chat_info['creator_ip'] != _params.user_ip:
            return self.dump_fail_data(3100)

        self.chat_list.delete_one(dict(chat_id=args.chat_id))

        res = dict(result=1, status=0, msg='Successfully.', data=None)
        self.finish_with_json(res)


class ChatMember(BaseHandler):
    """Handler message stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_form_arguments(['chat_id'])

        chat_list = self.chat_list.find_one({'chat_id': args.chat_id})

        if not chat_list:
            return self.dump_fail_data(3104)

        member_list = [
            member['user_ip'] for member in chat_list['chat_member']
        ]
        if _params.user_ip not in member_list:
            return self.dump_fail_data(3105)

        res = dict(result=1, status=0, msg='successfully.', data=None)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def post(self, *_args, **_kwargs):
        pass

    @asynchronous
    @coroutine
    def put(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        args = self.parse_json_arguments(['member_ip', 'chat_id'])

        user_info = self.wcd_user.find_one(dict(user_ip=args.member_ip))

        if not user_info:
            return self.dump_fail_data(3011)

        chat_info = self.chat_list.find_one(dict(chat_id=args.chat_id))
        if args.member_ip in chat_info['chat_member']:
            return self.dump_fail_data(3150)

        print(args.member_ip, user_info['nickname'])
        chat_info = self.chat_list.update_one(
            dict(chat_id=args.chat_id), {
                '$addToSet': {
                    'chat_member': {
                        'user_ip': args.member_ip,
                        'nickname': user_info['nickname']
                    }
                }
            })

        res = dict(result=1, status=0, msg='Successfully.', data=None)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def delete(self, *_args, **_kwargs):
        pass


class Message(BaseHandler):
    """Handler message stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(3)
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
        res = self.check_auth(3)
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
    (r'/chat-list', ChatRoom),
    (r'/chat-member', ChatMember),
]
