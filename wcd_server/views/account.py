# coding:utf-8
"""Views' Module of Account."""
import re
from hashlib import md5
from uuid import uuid1 as uuid
from tornado.gen import coroutine
from tornado.web import asynchronous

from base_handler import BaseHandler
from config import CFG as config


class AddressGuard(BaseHandler):
    """Handler account stuff."""

    if config.access_mode == 'reg':
        address_pattern = re.compile(config.access_regex)
    else:
        address_pattern = re.compile(r'')

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        if config.access_mode == 'reg':
            if not re.match(self.address_pattern, self.request.remote_ip):
                return self.dump_fail_data(3012)
        else:
            if self.request.remote_ip not in config.access_list:
                return self.dump_fail_data(3012)

        res = dict(result=1, status=0, msg='Successfully.', data=None)
        self.finish_with_json(res)


class NickGuard(BaseHandler):
    """Handler account stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        user_info = self.wcd_user.find_one({'user_ip': self.request.remote_ip})
        if user_info:
            return self.dump_fail_data(
                3014, data=dict(nickname=user_info['nickname']))

        res = dict(result=1, status=0, msg='Successfully.', data=None)
        self.finish_with_json(res)


class AuthGuard(BaseHandler):
    """Handler account stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        print(_params.arguments)
        res = dict(
            result=1, status=0, msg='successfully.', data=_params.arguments)
        self.finish_with_json(res)


class Account(BaseHandler):
    """Handler account stuff."""

    @asynchronous
    @coroutine
    def get(self, *_args, **_kwargs):
        res = self.check_auth(3)
        if not res:
            return
        else:
            _user_id, _params = res

        res = dict(
            result=1, status=0, msg='successfully.', data=_params.arguments)
        self.finish_with_json(res)

    @asynchronous
    @coroutine
    def post(self, *_args, **_kwargs):
        args = self.parse_json_arguments(['nickname', 'password'])
        user_info = self.wcd_user.find_one({'nickname': args.nickname})
        if not user_info:
            user_info = {
                'user_ip': self.request.remote_ip,
                'nickname': args.nickname,
                'password': md5(args.password.encode()).hexdigest(),
                'ac_code': uuid().hex
            }
            self.wcd_user.insert_one(user_info)
        elif md5(args.password.encode()).hexdigest() != user_info['password']:
            return self.dump_fail_data(3001)

        user_params = dict(
            user_ip=user_info['user_ip'],
            nickname=user_info['nickname'],
            ac_code=user_info['ac_code'])
        self.set_current_user(user_info['user_ip'] + user_info['ac_code'])
        self.set_parameters(user_params)

        res = dict(result=1, status=0, msg='successfully.', data=user_params)
        self.finish_with_json(res)

    # @asynchronous
    # @coroutine
    # def put(self, *_args, **_kwargs):
    #     args = self.parse_json_arguments(['nickname', 'password'])

    #     user_info = self.wcd_user.find_one({'nickname': args.nickname})
    #     if not user_info:
    #         self.wcd_user.insert_one({
    #             'ip': self.request.remote_ip,
    #             'nickname': args.nickname,
    #             'password': md5(args.password).hexdigest()
    #         })
    #     else:
    #         return self.dump_fail_data(3004)

    #     res = dict(result=1, status=0, msg='successfully.', data=None)
    #     self.finish_with_json(res)


ACCOUNT_URLS = [
    (r'/address_guard', AddressGuard),
    (r'/nick_guard', NickGuard),
    (r'/check_auth', AuthGuard),
    (r'/account', Account),
]