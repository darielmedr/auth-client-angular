import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { StorageKeys } from 'src/app/shared/enums/storage-keys.enum';
import { SessionData } from 'src/app/shared/models/session-data.model';
import { StorageKey } from 'src/app/shared/types/storage-key';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public storeSessionData(data: SessionData): void {
    const expiresAt = dayjs().add(data.expiresIn, 'ms').valueOf();

    this.setDataByKey('expires_at', expiresAt);
    this.setDataByKey('user', data.user);
  }

  public hasInvalidSessionData(): boolean {
    return Object.keys(StorageKeys)
      .map((key: any) => StorageKeys[key])
      .filter((value) => typeof value === 'string')
      .some((key) => {
        const data = this.getDataByKey(key as StorageKey);
        const result = !!data;
        return !result;
      });
  }

  public getDataByKey<T>(key: StorageKey): T | null {
    const data: string | null = localStorage.getItem(key);

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public setDataByKey(key: StorageKey, value: any): void {
    const data: string = JSON.stringify(value);

    localStorage.setItem(key, data);
  }

  public deleteDataByKey(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  public deleteSessionData(): void {
    localStorage.clear();
  }
}
