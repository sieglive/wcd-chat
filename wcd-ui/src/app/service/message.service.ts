import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MarkdownService } from './markdown.service';

@Injectable()
export class MessageService {
    public msg_info = new BehaviorSubject<object>({
        msg_list: [],
        id_list: [],
        fresh_info: false,
    });

    get info(): any {
        return this.msg_info;
    }

    set info(info: any) {
        if (this.conflict(info)) { return; }

        const msg_list = this.msg_info.value['msg_list'].slice();
        const new_id_list = this.msg_info.value['id_list'].slice();
        const new_msg_list = msg_list.concat(info);

        for (const msg of info) {
            new_id_list.push(msg['msg_id']);
        }

        this.msg_info.next({
            msg_list: new_msg_list,
            id_list: new_id_list,
            fresh_info: true,
        });
    }

    conflict(msg_list) {
        for (const msg of msg_list) {
            if (this.msg_info.value['id_list'].indexOf(msg['msg_id']) !== -1) {
                return true;
            }
        }
        return false;
    }

    hasFresh() {
        if (this.msg_info.value['fresh_info']) {
            this.msg_info.value['fresh_info'] = false;
            return true;
        }
        return false;
    }

    reloadMessage(info) {
        const id_list = [];

        for (const msg of info) {
            id_list.push(msg['msg_id']);
        }

        this.msg_info.next({
            msg_list: info,
            id_list: id_list
        });
    }
}
