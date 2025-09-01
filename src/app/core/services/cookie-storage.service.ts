import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CookieStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setCookie(name: string, value: string, days: number): void {
    if (!this.isBrowser()) return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  }

  getCookie(name: string): string | null {
    if (!this.isBrowser()) return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  deleteCookie(name: string): void {
    if (!this.isBrowser()) return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }

  saveToStorage<T>(key: string, data: T[]): void {
    if (!this.isBrowser()) return;
    
    try {
      this.setCookie(key, JSON.stringify(data), 365); // Expires in 1 year
    } catch (error) {
      console.warn(`Error saving ${key} to cookies:`, error);
    }
  }

  loadFromStorage<T>(key: string): T[] {
    if (!this.isBrowser()) return [];
    
    try {
      const stored = this.getCookie(key);
      if (stored) {
        return JSON.parse(stored) as T[];
      }
    } catch (error) {
      console.warn(`Error loading ${key} from cookies:`, error);
    }
    return [];
  }

  clearStorage(key: string): void {
    this.deleteCookie(key);
  }

  clearAllStorage(): void {
    // Clear all application-specific cookies
    const keysToDelete = ['proveedores', 'productos', 'jaulas', 'turnos'];
    keysToDelete.forEach(key => this.clearStorage(key));
  }
}
