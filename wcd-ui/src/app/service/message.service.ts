import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MessageService {
    public msg_info = new BehaviorSubject<Array<object>>([]);

    get info(): BehaviorSubject<Array<object>> {
        return this.msg_info;
    }

    set info(info) {
        console.log('1', info);
        let copied_data = this.msg_info.value.slice();
        console.log('2', copied_data);
        copied_data = copied_data.concat(info);
        console.log('3', copied_data);
        this.msg_info.next(copied_data);
    }

    reloadMessage(info) {
        this.msg_info.next(info);
    }
}
