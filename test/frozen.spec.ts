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
        expect(Object.isFrozen(Derived)).toBe(true);
        expect(Object.isFrozen(Frozen)).toBe(true);
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