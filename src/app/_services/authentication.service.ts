import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(`/api/account/login`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    register(data) {
        return this.http.post<any>(`/api/account/createAccount`, data)
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
            }

            return user;
        }));
    }

    setStatus(userId, status) {
        return this.http.post<any>(`/api/account/status`, {userId, status})
        .pipe(map(payload => {
            return payload;
        }));
    }

    getAll(user) {
        return this.http.post<any>(`/api/account/getAll`, {userId: user.userId})
        .pipe(map(users => {
            return users;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
