import { Injectable, Directive, Input, OnInit, ElementRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MessageService {
    public msg_info = new BehaviorSubject<Array<object>>([]);

    get info(): BehaviorSubject<Array<object>> {
        return this.msg_info;
    }

    set info(info) {
        let copied_data = this.msg_info.value.slice();
        copied_data = copied_data.concat(info);
        this.msg_info.next(copied_data);
    }

    reloadMessage(info) {
        this.msg_info.next(info);
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
