import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';

interface LocalUser {
  _id: string;
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private db = new PouchDB('local_auth');

  constructor() {
    this.seedDefaultUser();
  }

  private async seedDefaultUser(): Promise<void> {
    try {
      await this.db.get('user:user@aemenersol.com');
    } catch (error: any) {
      if (error.status === 404) {
        const defaultUser: LocalUser = {
          _id: 'user:user@aemenersol.com',
          username: 'user@aemenersol.com',
          password: 'Test@123',
          role: 'User'
        };

        await this.db.put(defaultUser);
      }
    }
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.db.get(`user:${username}`) as LocalUser;
      return user.username === username && user.password === password;
    } catch {
      return false;
    }
  }
}