import { frozen } from "../src";

describe("frozen", () => {
    it("freezes the constructor", () => {
        @frozen class Frozen {}
        expect(Object.isFrozen(Frozen)).toBe(true);
    });

    it("freezes the prototype chain", () => {
        class Root {}
        class Derived extends Root {}
        @frozen class Frozen extends Derived {}
        expect(Object.isFrozen(Root)).toBe(true);
        expect(Object.isFrozen(Root.prototype)).toBe(true);
        expect(Object.isFrozen(Derived)).toBe(true);
        expect(Object.isFrozen(Derived.prototype)).toBe(true);
        expect(Object.isFrozen(Frozen)).toBe(true);
        expect(Object.isFrozen(Frozen.prototype)).toBe(true);
    });

    it("doesn't freeze Object", () => {
        @frozen class Frozen {}
        expect(Object.isFrozen(Frozen)).toBe(true);
        expect(Object.isFrozen(Frozen.prototype)).toBe(true);
        expect(Object.isFrozen(Object)).toBe(false);
        expect(Object.isFrozen(Object.prototype)).toBe(false);
    });

    it("freezes instances", () => {
        @frozen class Frozen {}
        const instance = new Frozen();
        expect(Object.isFrozen(instance)).toBe(true);
    });

    it("doesn't break the prototype chain", () => {
        @frozen class Frozen {}
        const instance = new Frozen();
        expect(instance).toBeInstanceOf(Frozen);
    });

    it("keeps the same name", () => {
        @frozen class MyClass {}
        expect(MyClass.name).toBe("MyClass");
    });
});