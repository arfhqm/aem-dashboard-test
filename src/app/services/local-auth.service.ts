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
  private seedPromise: Promise<void>;

  constructor() {
    this.seedPromise = this.seedDefaultUser();
  }

  private async seedDefaultUser(): Promise<void> {
    try {
      await this.db.get('user:user@aemenersol.com');
    } catch (error: any) {
      if (error.status === 404) {
        await this.db.put({
          _id: 'user:user@aemenersol.com',
          username: 'user@aemenersol.com',
          password: 'Test@123',
          role: 'User'
        });
      }
    }
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    await this.seedPromise;

    try {
      const user = await this.db.get(`user:${username}`) as LocalUser;
      return user.username === username && user.password === password;
    } catch {
      return false;
    }
  }
}