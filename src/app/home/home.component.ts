import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import io from 'socket.io-client';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: any = {};
    users: any[] = [];
    selectedStatus;

    constructor(private authService: AuthenticationService) {
        const payload = JSON.parse(localStorage.getItem('currentUser')) || {};
        this.currentUser = payload.account;
        
        if (this.currentUser) {
            this.selectedStatus = this.currentUser.status;
        }
    }

    ngOnInit() {
      
        if (this.currentUser && this.currentUser.isAdmin) {
            const socket = io('http://localhost:8500');
            socket.on("connect", () => {
                console.log('Socket Connected');
            });
            socket.on('userStatus', (account)=> {
                this.users.forEach((user)=> {
                    if(user.userId === account.userId){
                        user.status = account.status;
                    }
                });
            });
        this.loadAllUsers();
        }
    }
    onLogout(){
        this.authService.logout();
    }
    onStatusChange() {
        const userId = this.currentUser.userId;

        this.authService.setStatus(userId, this.selectedStatus).subscribe((payload) => {
            console.log('status ', payload);
        });
    }

    private loadAllUsers() {
        this.authService.getAll(this.currentUser).pipe(first()).subscribe(users => {
            this.users = users.filter((user)=> !user.isAdmin);
        });
    }

}
