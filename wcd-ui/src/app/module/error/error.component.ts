import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'wcd-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
    public message = 'Page Not Found';
    public sub_message = 'Sorry for that.';
    constructor(private _router: Router) { }

    ngOnInit() {
        this._router.routerState.root.queryParams.subscribe(
            value => {
                if (value.message && value.sub_message) {
                    this.message = value.message;
                    this.sub_message = value.sub_message;
                }
            }
        );
    }

}
