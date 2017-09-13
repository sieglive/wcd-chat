import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccountService {
    public account_info = new BehaviorSubject<object>({});

    get info(): BehaviorSubject<object> {
        return this.account_info;
    }

    set info(info) {
        this.account_info.next(info);
    }
}
