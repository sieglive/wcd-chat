import { Injectable, Directive, Input, OnInit, ElementRef, OnChanges, AfterViewInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MarkdownService } from './markdown.service';

import 'prismjs/prism';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';

declare var Prism: any;

Prism.languages.python = {
    'triple-quoted-string': {
        pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/,
        alias: 'string'
    },
    'comment': {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
    },
    'string': {
        pattern: /[rfbu]?("|')(?:\\\\|\\?[^\\\r\n])*?\1/,
        greedy: true
    },

    'function': {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
        lookbehind: true
    },
    'variable': {
        pattern: /(?:(^|\s)def[ \t]+[a-zA-Z_][a-zA-Z0-9_]*\(.*[ ,(])[a-zA-Z_][a-zA-Z0-9_]*(?=[ ,)])(?:.*)(?=\))/,
        // lookbehind: true
    },
    'builtin': /\b(?:class|def|from|import|lambda|dict|list|tuple|set|print|range)\b/,
    'method': {
        pattern: /(\.[a-zA-Z_][a-zA-Z0-9_]*(?=\())/,
    },
    'method2': {
        pattern: /(?:[a-zA-Z_][a-zA-Z0-9_]*(?=\())/,
    },
    'class-name': {
        pattern: /(\bclass\s+)[a-z0-9_]+/i,
        lookbehind: true
    },
    'keyword': /\b(?:as|assert|async|await|break|continue|del|elif|else)\b/,
    'keyword2': /\b(?:except|exec|finally|for|global|if|in|is|pass|raise|return|try|while|with|yield)\b/,
    'boolean': /\b(?:True|False)\b/,
    'number': /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
    'punctuation': /[{}[\];(),.:]/
};



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
    selector: 'markdown,[appMarkdown]'
})
export class AppMarkdownDirective implements OnInit, OnChanges {
    private _path: string;
    private _data: string;
    private _md: any;
    private _ext: string;
    changeLog: string[] = [];


    constructor(
        private _markdown: MarkdownService,
        private el: ElementRef,
        private mdService: MarkdownService,
    ) { }
    ngOnChanges(changes: any) {

    }

    ngOnInit() {

    }

    @Input()
    set data(value: string) {
        if (value) {
            this._data = value;
            this.onDataChange(value);
        }
    }

    onDataChange(data: string) {
        if (data) {
            this.el.nativeElement.innerHTML = this.mdService.compile(data);
        } else {
            this.el.nativeElement.innerHTML = '';
        }
        // console.log(this.el);
        Prism.highlightAll(false);
    }
}
