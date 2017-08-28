import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class SnackBarService {

    constructor(public snack_bar: MdSnackBar) { }

    raiseSnackBar(message: string, action_name?: string, action?) {
        const snack_ref = this.snack_bar.open(
            message,
            action_name,
            {
                duration: 2000,
            }
        );
        if (action_name) {
            snack_ref.onAction().subscribe(action);
        }
        return false;
    }
}
