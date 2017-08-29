import { Injectable, Directive, Input, OnInit, ElementRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MessageService {
    public msg_info = new BehaviorSubject<object>({
        msg_list: [],
        id_list: []
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
            id_list: new_id_list
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

@Directive({
    selector: '[appWcdAvator]',
})
export class WcdAvatorDirective implements OnInit {
    @Input() wcdAvatorColor: string;
    private _color = [
        'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue',
        'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'orange',
        'amber', 'deep-orange'
    ];
    private _color_palette = {
        'red': ['#ef5350', 'black'],
        'pink': ['#ec407a', 'black'],
        'purple': ['#ab47bc', 'white'],
        'deep-purple': ['#7e57c2', 'white'],
        'indigo': ['#5c6bc0', 'white'],
        'blue': ['#42a5f5', 'black'],
        'light-blue': ['#29b6f6', 'black'],
        'cyan': ['#26c6da', 'black'],
        'teal': ['#26a69a', 'black'],
        'green': ['#66bb6a', 'black'],
        'light-green': ['#9ccc65', 'black'],
        'lime': ['#d4e157', 'black'],
        'yellow': ['#ffee58', 'black'],
        'orange': ['#ffa726', 'black'],
        'amber': ['#ffca28', 'black'],
        'deep-orange': ['#ff7043', 'black']
    };

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.el.nativeElement.style.backgroundColor = this._color_palette[this.wcdAvatorColor][0];
        this.el.nativeElement.style.color = this._color_palette[this.wcdAvatorColor][1];
    }
}
