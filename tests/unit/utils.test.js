import { describe, it, expect, beforeEach, vi } from "vitest";
import { isActivePath } from "../../js/utils/userInterface.js";
import { getUsername, saveUser } from "../../js/utils/storage.js";

// Mock localStorage for storage tests
const localStorageData = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => localStorageData[key] ?? null),
  setItem: vi.fn((key, value) => {
    localStorageData[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorageData[key];
  }),
  clear: vi.fn(() => {
    for (const key of Object.keys(localStorageData)) {
      delete localStorageData[key];
    }
  }),
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("isActivePath", () => {
  it("returns true when current path matches href exactly", () => {
    expect(isActivePath("/login", "/login")).toBe(true);
  });

  it("returns true for root path '/' when current path is '/'", () => {
    expect(isActivePath("/", "/")).toBe(true);
  });

  it("returns true for root path '/' when current path is '/index.html'", () => {
    expect(isActivePath("/", "/index.html")).toBe(true);
  });

  it("returns true when current path includes the href", () => {
    expect(isActivePath("/venue/", "/venue/123")).toBe(true);
  });

  it("returns false when paths don't match", () => {
    expect(isActivePath("/login", "/register")).toBe(false);
  });
});

describe("getUsername", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it("returns the name from the user object in storage", () => {
    const user = { name: "TestUser", email: "test@example.com" };
    saveUser(user);
    expect(getUsername()).toBe("TestUser");
  });

  it("returns null when no user exists in storage", () => {
    expect(getUsername()).toBeNull();
  });
});
