import { TestBed } from '@angular/core/testing';
import { SessionData } from 'src/app/shared/models/session-data.model';
import { UserData } from 'src/app/shared/models/user-data.model';
import { StorageKey } from 'src/app/shared/types/storage-key';
import { StorageService } from './storage.service';
import MockDate from 'mockdate';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("#storeSessionData()", () => {
    const mockSessionData: SessionData = {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain'
      } as UserData,
      expiresIn: 1000 * 1 // 1 second
    };

    it("should store user data in localStorage as stringified Json with key 'user'", () => {
      service.storeSessionData(mockSessionData);

      const key = 'user';
      const expectedValue = localStorage.getItem(key) as string;
      const userStringified = JSON.stringify(mockSessionData.user);

      expect(userStringified).toBe(expectedValue);
    });

    it("should store expiration date (current date + expiresIn) as ms in localStorage with key 'expires_at'", () => {

      const mockCurrentDate = 1234567890;
      MockDate.set(mockCurrentDate);

      service.storeSessionData(mockSessionData);

      const key = 'expires_at';
      const expectedValue = localStorage.getItem(key) as string;

      const expirationDate = mockCurrentDate + mockSessionData.expiresIn;

      expect(expirationDate.toString()).toBe(expectedValue);

      MockDate.reset();
    });
  });

  describe("#hasInvalidSessionData() should get data saved in localStorage by keys of #StorageKeys and", () => {
    it("return FALSE when all session data are defined", () => {
      const mockUser: UserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain',
      };
      const mockExpirationDate: number = 1000 * 1;

      spyOn(localStorage, 'getItem')
        .withArgs('user' as StorageKey).and.returnValue(JSON.stringify(mockUser))
        .withArgs('expires_at' as StorageKey).and.returnValue(JSON.stringify(mockExpirationDate));

      const result = service.hasInvalidSessionData();
      expect(result).toBeFalse();
    });

    it("return TRUE when 'user' session data is undefined", () => {
      const mockExpirationDate: number = 1000 * 1;

      spyOn(localStorage, 'getItem')
        .withArgs('user' as StorageKey).and.returnValue(null)
        .withArgs('expires_at' as StorageKey).and.returnValue(JSON.stringify(mockExpirationDate));

      const result = service.hasInvalidSessionData();
      expect(result).toBeTrue();
    });

    it("return TRUE when 'expires_at' session data is undefined", () => {
      const mockUser: UserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain',
      };

      spyOn(localStorage, 'getItem')
        .withArgs('user' as StorageKey).and.returnValue(JSON.stringify(mockUser))
        .withArgs('expires_at' as StorageKey).and.returnValue(null);

      const result = service.hasInvalidSessionData();
      expect(result).toBeTrue();
    });
  });

  describe("#getDataByKey()", () => {
    it("should return saved value in localStorage parsed to JSON format", () => {
      const mockUser: UserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain',
      };
      const key: StorageKey = 'user';

      spyOn(localStorage, 'getItem')
        .withArgs(key).and.returnValue(JSON.stringify(mockUser));

      const result = service.getDataByKey(key);

      expect(result).toEqual(mockUser);
    });

    it("should return null when data is not saved in localStorage by key", () => {
      const key: StorageKey = 'user';

      spyOn(localStorage, 'getItem').withArgs(key).and.returnValue(null);

      const result = service.getDataByKey(key);

      expect(result).toBeNull();
    });
  });

  it("#setDataByKey() should save data in localStorage stringified", () => {
    const mockUser: UserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@domain',
    };
    const key: StorageKey = 'user';

    const spy = spyOn(localStorage, 'setItem');

    const expectedValue = JSON.stringify(mockUser);
    service.setDataByKey(key, mockUser);

    expect(spy).toHaveBeenCalledWith(key, expectedValue);
  });

  it("#deleteDataByKey() should remove data in localStorage by key", () => {
    const key: StorageKey = 'user';

    const spy = spyOn(localStorage, 'removeItem');

    service.deleteDataByKey(key);

    expect(spy).toHaveBeenCalledWith(key);
  });

  it("#deleteSessionData() should clear localStorage", () => {
    const spy = spyOn(localStorage, 'clear');

    service.deleteSessionData();

    expect(spy).toHaveBeenCalled();
  });
});
