# coding:utf-8
"""Base module for other views' modules."""
import json
import sys
import re
import time

from tornado import gen, httpclient
from tornado.web import HTTPError, MissingArgumentError, RequestHandler
from models import m_client
from config import CFG as config

STATUS_DICT = dict([
    # Normal Error
    (3001, 'Username or password is invalid'),
    (3002, 'Account is inactivated.'),
    (3003, 'Email not Register'),
    (3004, 'Account is already exists, please login.'),
    (3005, 'User\'s session key not exists, need to login.'),
    (3006, 'User\'s session value not exists, need to login'),
    (3007, 'Other people login this account, session is invalid.'),
    (3008, 'User Permission Deny.'),
    (3009, 'Not Regular Password'),
    (3100, 'Parameter value type error.'),
    (3101, 'Upload File Error'),
    (3102, 'File Type Error'),
    (3103, 'User Error'),
    (3105, 'No Password Record Found'),
    (3106, 'Parameter\'s value empty.'),
    (3107, 'Free times out.'),
    (3108, 'Argument "emails" is not an array.'),
    (3109, 'email %s is not available.'),
    (3199, 'Flow not completed'),
    (3201, 'Access code error.'),
    (3202, 'File is broken.'),
    (3203, 'Convert File to Image Failed.'),
    (3399, 'No new orders found.'),

    # Client Error
    (3400, 'Missing argument.'),
    (3404, 'Page not found.'),
    # Server Error
    (3500, 'Server error'),
    (3502, 'Bad gateway.'),
    (3504, 'Connection time out.'),
    (3599, 'Network Connect Timeout.'),
    # Undefine Error
    (3999, 'result is not 1.'), ])


# class Tasks:
#     """Manager class of tasks."""

#     def __init__(self, params):
#         if isinstance(params, dict):
#             self.tasks = params
#         else:
#             raise TypeError(
#                 f"Arguments data should be a 'dict' not {type(params)}.")

#     def __getattr__(self, task_name):
#         task = self.tasks.get(task_name)
#         if task is None:
#             raise KeyError(task_name)
#         else:
#             return task

#     def __iter__(self):
#         for i in self.tasks:
#             yield i

#     def __getitem__(self, name):
#         task = self.tasks.get(name)
#         if task is None:
#             raise KeyError(name)
#         else:
#             return task

#     def as_dict(self):
#         """Return the task dictionary."""
#         return self.tasks

#     def keys(self):
#         """Return the keys of the task dictionary."""
#         return self.tasks.keys

def underline_to_camel(underline_format):
    """Turn a underline format string to a camel format string."""
    pattern = re.split(r'_', underline_format)
    for i in range(1, len(pattern)):
        pattern[i] = pattern[i].capitalize()
    return ''.join(pattern)


def camel_to_underline(camel_format):
    """Turn a camel format string to a underline format string."""
    pattern = re.split(r'([A-Z])', camel_format)
    result = pattern[:1]
    result += [
        pattern[i].lower() + pattern[i + 1].lower()
        for i in range(1, len(pattern), 2)
    ]
    return '_'.join(result)


class Arguments(object):
    """Class to manage arguments of a requests."""

    def __init__(self, params):
        if isinstance(params, dict):
            self.arguments = params
        else:
            raise TypeError(
                f"Arguments data should be a 'dict' not {type(params)}.")

    def __getattr__(self, name):
        attr = self.arguments.get(name)
        if isinstance(attr, dict):
            attr = Arguments(attr)
        return attr

    def __getitem__(self, name):
        attr = self.arguments.get(name)
        if attr is None:
            raise KeyError(name)
        else:
            return attr

    def as_dict(self):
        """Return all the arguments as a dictonary."""
        return self.arguments

    def add(self, key, value):
        """Add a variable to args."""
        self.arguments[key] = value


class ParseJSONError(HTTPError):
    """Exception raised by `BaseHandler.parse_json`.

    This is a subclass of `HTTPError`, so if it is uncaught a 400 response
    code will be used instead of 500 (and a stack trace will not be logged).
    """

    def __init__(self, doc):
        super(ParseJSONError, self).__init__(
            400, 'ParseJSONError. Decode JSON data in request body failed.')
        self.doc = doc


class BaseHandler(RequestHandler):
    """Custom handler for other views module."""
    session = m_client.session
    # Set the public head here.
    # pub_head = dict(
    #     version='?v=20160301&t=' + str(time.time()),
    #     base_url=options.BASE_URL,
    #     base_static_url=options.BASE_STATIC_URL,
    #     base_resource_url=options.BASE_RESOURCE_URL,
    # )

    # Rewrite abstract method
    @gen.coroutine
    def get(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def post(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def put(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def delete(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def head(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def options(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def patch(self, *args, **kwargs):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def data_received(self, chunk):
        self.write('405: Method Not Allowed')

    @gen.coroutine
    def fetch_back(self, interface, method='GET',
                   body=None, headers=None, **_kwargs):
        """Fetch Info from backend."""
        url = f'http://{config.server.back_ip}{interface}'
        _headers = dict(host=config.domain.root)
        if headers:
            _headers.update(headers)

        if not body:
            body = dict()
        back_info = yield httpclient.AsyncHTTPClient().fetch(
            url,
            method=method,
            headers=_headers,
            body=json.dumps(body),
            raise_error=False,
            allow_nonstandard_methods=True, )

        res = dict(
            http_code=back_info.code,
            res_body=back_info.body.decode() if back_info.body else None,
            interface=interface)

        if back_info.code >= 400:
            return Arguments(res)
        try:
            info = json.loads(res['res_body'])
            res.update(info)
        except json.JSONDecodeError:
            print(res['res_body'])

        return Arguments(res)

    def try_to_get_arg(self, name, default=None):
        """Get argument of specify key,
        if not exists ,return default value."""
        try:
            return self.get_argument(name)
        except MissingArgumentError:
            return default

    def get_current_user(self):
        """Get the current user from cookie."""
        user_id = self.get_secure_cookie('uoo')
        if isinstance(user_id, bytes):
            user_id = user_id.decode()
        return user_id

    def set_current_user(self, user_id=''):
        """Set current user to cookie."""
        self.set_secure_cookie(
            'uoo',
            user_id,
            expires=time.time() + config.server.expire_time,
            domain=self.request.host
        )

    def get_parameters(self):
        """Get user information from cookie."""
        params = self.get_secure_cookie('poo')
        params = json.loads(params.decode()) if params else dict()
        return Arguments(params)

    def set_parameters(self, params='', expire_time=3600):
        """Set user information to the cookie."""
        if isinstance(params, dict):
            params = json.dumps(params)
        self.set_secure_cookie(
            'poo',
            params,
            expires=time.time() + expire_time,
            domain=self.request.host
        )
        return True

    def get_password(self):
        """Get the user name and password from cookie."""
        params = self.get_secure_cookie('foo')
        params = json.loads(params.decode()) if params else dict()
        return Arguments(params)

    def set_password(self, params, expire_time=2592000):
        """Set the user name and password to cookie."""
        self.set_secure_cookie(
            'foo',
            json.dumps(params),
            expires=time.time() + expire_time,
            domain=self.request.host
        )

    def check_auth(self, check_level=1):
        """Check user status."""
        user_id = self.get_current_user()
        params = self.get_parameters()

        if not user_id or not params:
            self.set_current_user('')
            self.set_parameters({})
            self.dump_fail_data(3005)
            return False

        if check_level is 1:
            self.set_current_user(self.get_current_user())
            self.set_parameters(self.get_parameters().arguments)
            return (user_id, params)

        if not params.user_id or params.user_id != user_id:
            self.set_current_user('')
            self.set_parameters({})
            self.dump_fail_data(3006)
            return False

        elif check_level is 2:
            self.set_current_user(self.get_current_user())
            self.set_parameters(self.get_parameters().arguments)
            return (user_id, params)

        sess_info = self.session.find_one({'user_id': user_id})
        if sess_info:
            ac_code = sess_info.get('ac_code')
        else:
            ac_code = None
        if not params.ac_code or not ac_code or params.ac_code != ac_code:
            self.set_current_user('')
            self.set_parameters({})
            self.dump_fail_data(3007)
            return False
        elif check_level is 3:
            self.set_current_user(self.get_current_user())
            self.set_parameters(self.get_parameters().arguments)
            return (user_id, params)

        role = params.get('role')
        if role != 'normal':
            self.set_current_user('')
            self.set_parameters({})
            self.dump_fail_data(3008)
            return False
        elif check_level is 4:
            self.set_current_user(self.get_current_user())
            self.set_parameters(self.get_parameters().arguments)
            return (user_id, params)

        self.set_current_user(self.get_current_user())
        self.set_parameters(self.get_parameters().arguments)
        return (user_id, params)

    @gen.coroutine
    def can_not_send(self, params):
        """Check sent times of user."""
        if not params:
            self.dump_fail_data(3005)
            return True
        if params.get('permission'):
            return False

        elif params.get('user_id'):
            sess_info = self.session.find_one(
                {'user_id': params['user_id']})
            sent_times = sess_info.get('free_count')
            if sent_times is None:
                back_info = yield self.fetch_back(
                    interface='/back/doc/free',
                    method='GET',
                    body=dict(
                        user_id=params['user_id']))
                if back_info.http_code >= 400:
                    self.dump_fail_data(3000 + back_info.http_code,
                                        back_info.arguments)
                    return True
                elif not back_info.result:
                    self.dump_fail_data(3999, back_info.arguments)
                    return True

                self.session.update_one(
                    dict(user_id=params['user_id']),
                    {'$set': {'free_count': back_info.data.times}})
                sent_times = back_info.data.times
            if sent_times >= config.sent_limit:
                self.dump_fail_data(3107)
                return True
            else:
                return False
        else:
            self.dump_fail_data(3005)
            return True

    def dump_fail_data(self, status, back_data=None, polyfill=None, **_kwargs):
        """assemble and return error data."""
        if status in STATUS_DICT:
            msg = STATUS_DICT[status]
        else:
            print(status)
            raise KeyError(
                'Given status code is not in the status dictionary.')

        if polyfill:
            msg %= polyfill
        res = dict(
            result=0,
            status=status,
            msg=msg,
            back_data=back_data,
            **_kwargs)
        self.finish_with_json(res)
        return

    # def check_json_args(self, data, key_list):
    #     """Check if data match given key list."""
    #     for key in key_list:
    #         if key not in data:
    #             return False
    #         else:
    #             return True

    def parse_form_arguments(self, key_list):
        """Parse JSON argument like `get_argument`."""
        if config.debug:
            sys.stdout.write('\n\n' + '>' * 80)
            sys.stdout.write('\n' + (f'Input: '
                                     f'{self.request.method} '
                                     f'{self.request.path}') + '\n\n')
            sys.stdout.write(self.request.body.decode()[:500])
            sys.stdout.write('\n\n' + '>' * 80 + '\n')
            sys.stdout.flush()

        req = dict()

        for key in key_list:
            req[camel_to_underline(key)] = self.get_argument(key)

        req['user_ip'] = self.request.remote_ip

        return Arguments(req)

    def parse_json_arguments(self, key_list):
        """Parse JSON argument like `get_argument`."""
        try:
            if config.debug:
                sys.stdout.write('\n\n' + '>' * 80)
                sys.stdout.write('\n' + (f'Input: '
                                         f'{self.request.method} '
                                         f'{self.request.path}') + '\n\n')
                sys.stdout.write(self.request.body.decode()[:500])
                sys.stdout.write('\n\n' + '>' * 80 + '\n')
                sys.stdout.flush()
            req = json.loads(self.request.body.decode('utf-8'))
        except json.JSONDecodeError as exception:
            # self.dump_fail_data(
            #     exc_doc=exception.doc, msg=exception.args[0], status=1)
            sys.stdout.write(self.request.body.decode())
            sys.stdout.write('\n')
            sys.stdout.flush()
            raise ParseJSONError(exception.doc)

        if not isinstance(req, dict):
            sys.stdout.write(self.request.body.decode())
            sys.stdout.write('\n')
            sys.stdout.flush()
            raise ParseJSONError('Req should be a dictonary.')

        for key in list(req.keys()):
            req[camel_to_underline(key)] = req[key]

        for key in key_list:
            if key not in req:
                sys.stdout.write(self.request.body.decode())
                sys.stdout.write('\n')
                sys.stdout.flush()
                raise MissingArgumentError(key)

        req['user_ip'] = self.request.remote_ip

        return Arguments(req)

    def finish_with_json(self, data):
        """Turn data to JSON format before finish."""
        if config.debug:
            sys.stdout.write('' + '-' * 80)
            sys.stdout.write('\n' + (f'Output: '
                                     f'{self.request.method} '
                                     f'{self.request.path}') + '\n\n')
            sys.stdout.write(str(data))
            sys.stdout.write('\n\n' + '-' * 80 + '\n\n')
            sys.stdout.flush()
        self.finish(json.dumps(data).encode())

    def write_with_json(self, data):
        """Turn data to JSON format before write."""
        self.write(json.dumps(data).encode())

    # # Bind function to the config.
    # @gen.coroutine
    # def waiting_upload(self, func, args=None, kwargs=None):
    #     result = yield self.waiting_result(
    #         func, args=args, kwargs=kwargs, queue=options.queue_upload)
    #     return result

    # @gen.coroutine
    # def waiting_payment(self, func, args=None, kwargs=None):
    #     result = yield self.waiting_result(
    #         func, args=args, kwargs=kwargs, queue=options.queue_payment)
    #     return result

    # @gen.coroutine
    # def waiting_query(self, func, args=None, kwargs=None):
    #     result = yield self.waiting_result(
    #         func, args=args, kwargs=kwargs, queue=options.queue_query)
    #     return result

    # Waiting result of celery task without blocking.
    @gen.coroutine
    def waiting_result(self, func, args=None, kwargs=None):
        """Method to waiting celery result."""
        async_task = func.apply_async(args=args, kwargs=kwargs)

        while True:
            if async_task.status in ['PENDING', 'PROGRESS']:
                yield gen.sleep(config.waiting_sleep_time)
            elif async_task.status in ['SUCCESS', 'FAILURE']:
                break
            else:
                print('\n\nUnknown status:\n', async_task.status, '\n\n\n')
                break

        if async_task.status != 'SUCCESS':
            print(async_task.status, async_task.result)
            print(async_task)
            return dict(result=0, status=1, data=async_task.result)
        else:
            return async_task.result

    # # For the important task, retry if the task failed.
    # @gen.coroutine
    # def retry(self, query, queue, args=None, kwargs=None):
    #     action = 'fail'
    #     result = None
    #     for i in range(5):
    #         action, result = yield self.waiting_result(
    #             query(
    #                 args=args,
    #                 kwargs=kwargs,
    #                 retry=False,
    #                 queue=queue
    #             ))
    #         if action != 'fail':
    #             break
    #         yield gen.sleep(0.4)

    #     return action, result
