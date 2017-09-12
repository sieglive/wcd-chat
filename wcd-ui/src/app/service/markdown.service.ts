import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as  marked from 'marked';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';



@Injectable()
export class MarkdownService {
    private _renderer: any = new marked.Renderer();
    constructor() {
        this.extendRenderer();
        this.setMarkedOptions({});
    }

    public get renderer() {
        return this._renderer;
    }

    // handle data
    public setMarkedOptions(options: any) {
        options = Object.assign({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        }, options);
        options.renderer = this._renderer;
        marked.setOptions(options);
    }

    // comple markdown to html
    public compile(data: string) {
        return marked(data);
    }

    // extend marked render to support todo checkbox
    private extendRenderer() {
        this._renderer.listitem = function (text: string) {
            if (/^\s*\[[x ]\]\s*/.test(text)) {
                text = text
                    .replace(
                    /^\s*\[ \]\s*/,
                    `<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; "
                     disabled> `)
                    .replace(
                    /^\s*\[x\]\s*/,
                    `<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; "
                     checked disabled> `);
                return '<li style="list-style: none">' + text + '</li>';
            } else {
                return '<li>' + text + '</li>';
            }
        };
    }
}
