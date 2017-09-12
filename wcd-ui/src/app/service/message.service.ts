import { Injectable, Directive, Input, OnInit, ElementRef, OnChanges, AfterViewInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MarkdownService } from './markdown.service';

import { HighlightJsService } from 'angular2-highlight-js';

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

@Directive({
    selector: '[appMarkDown]'
})
export class AppMarkdownDirective implements OnInit, OnChanges, AfterViewInit {
    private _path: string;
    private _data: string;
    private _md: any;
    private _ext: string;
    changeLog: string[] = [];


    constructor(
        private _markdown: MarkdownService,
        private el: ElementRef,
        private _hljsservice: HighlightJsService,
        private mdService: MarkdownService,
    ) { }
    ngOnChanges(changes: any) {
        // const element_list = this.el.nativeElement.querySelectorAll('pre code');
        // const element_list = this.el.nativeElement.querySelectorAll('pre code');
        // for (let i = 0; i < element_list.length; i++) {
        //     this._hljsservice.highlight(element_list[i]);
        // }
    }

    ngOnInit() {

    }

    // @Input()
    // set path(value: string) {
    //     if (value) {
    //         this._path = value;
    //         this.onPathChange();
    //     }
    // }

    @Input()
    set data(value: string) {
        if (value) {
            this._data = value;
            this.onDataChange(value);
        }
    }


    // on input
    onDataChange(data: string) {
        if (data) {
            this.el.nativeElement.innerHTML = this.mdService.compile(data);
        } else {
            this.el.nativeElement.innerHTML = '';
        }
        // Prism.highlightAll(false);
    }

    /**
     *  After view init
     */
    ngAfterViewInit() {
        // if (this._path) {
        //     this.onPathChange();
        // } else if (!this._data) {
        //     this.processRaw();
        // }
    }

    // processRaw() {
    //     this._md = this.prepare(this.el.nativeElement.innerHTML);
    //     this.el.nativeElement.innerHTML = this.mdService.compile(this._md);
    //     // Prism.highlightAll(false);
    // }

    /**
     * get remote conent;
     */
    // onPathChange() {
    //     this._ext = this._path && this._path.split('.').splice(-1).join();
    //     this.mdService.getContent(this._path)
    //         .subscribe(data => {
    //             this._md = this._ext !== 'md' ? '```' + this._ext + '\n' + data + '\n```' : data;
    //             this.el.nativeElement.innerHTML = this.mdService.compile(this.prepare(this._md));
    //             // Prism.highlightAll(false);
    //         },
    //         err => this.handleError);
    // }

    /**
     * catch http error
     */
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    /**
     * Prepare string
     */
    // prepare(raw: string) {
    //     if (!raw) {
    //         return '';
    //     }
    //     if (this._ext === 'md' || !this.path) {
    //         let isCodeBlock = false;
    //         return raw.split('\n').map((line: string) => {
    //             if (this.trimLeft(line).substring(0, 3) === "```") {
    //                 isCodeBlock = !isCodeBlock;
    //             }
    //             return isCodeBlock ? line : line.trim();
    //         }).join('\n');
    //     }
    //     return raw.replace(/\"/g, '\'');
    // }

    /**
     * Trim left whitespace
     */
    private trimLeft(line: string) {
        return line.replace(/^\s+|\s+$/g, '');
    }
}
