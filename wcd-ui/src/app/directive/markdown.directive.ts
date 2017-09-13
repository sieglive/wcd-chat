import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { MarkdownService } from 'service/markdown.service';

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

@Directive({
    selector: 'markdown,[wcdMarkdown]'
})
export class MarkdownDirective implements OnInit {
    private _data: string;

    constructor(
        private _markdown: MarkdownService,
        private el: ElementRef,
        private mdService: MarkdownService,
    ) { }

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
        Prism.highlightAll(false);
    }
}
