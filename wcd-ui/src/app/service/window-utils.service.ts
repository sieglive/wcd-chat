import { Injectable } from '@angular/core';

@Injectable()
export class WindowUtilsService {

    constructor() { }

    scrollBottom(obj) {
        setTimeout(
            () => {
                obj.chat_show.nativeElement.scrollTop = obj.chat_show.nativeElement.scrollHeight;
            }, 0);
    }

    renderDocTitle(title, format?) {
        if (!format) {
            document.title = title;
        } else {

        }
    }

}
