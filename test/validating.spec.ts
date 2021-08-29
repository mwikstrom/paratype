/* eslint-disable @typescript-eslint/no-empty-function */
import { integerType, restType, type, validating } from "../src";

describe("validating", () => {
    it("verifies this binding", () => {
        @validating class VerifyThis {
            func(): void {}
        }
        const { func } = new VerifyThis();
        expect(func).toThrow("VerifyThis.func(...): Invalid this binding");
    });

    it("verifies this binding of symbolic function", () => {
        const sym = Symbol("func");
        @validating class VerifySymbolicThis {
            [sym](): void {}
        }
        const { [sym]: func } = new VerifySymbolicThis();
        expect(func).toThrow("VerifySymbolicThis[func](...): Invalid this binding");
    });

    it("verifies static function parameters", () => {
        @validating class Calc {
            static sum(
                @type(integerType) x: number,
                @type(integerType) y: number,
            ): number {
                return x + y;
            }
        }
        expect(Calc.sum(1, 2)).toBe(3);
        expect(() => Calc.sum(1, 2.5)).toThrow("static Calc.sum(...): Argument #1: Must be a safe integer");
    });

    it("verifies function parameters", () => {
        @validating class Counter {
            #value = 0;
            add(@type(integerType) value: number): number {
                return this.#value += value;
            }
        }
        const counter = new Counter();
        expect(counter.add(12)).toBe(12);
        expect(counter.add(34)).toBe(46);
        expect(() => counter.add(5.6)).toThrow("Counter.add(...): Argument #0: Must be a safe integer");
    });

    it("verifies constructor parameters", () => {
        @validating class VerifyCtor {
            public readonly value;
            constructor(@type(integerType) value: number) {
                this.value = value;
            }
        }
        expect(new VerifyCtor(12).value).toBe(12);
        expect(() => new VerifyCtor(5.6)).toThrow("new VerifyCtor(...): Argument #0: Must be a safe integer");
    });

    it("verifies rest parameters", () => {
        @validating class RestCalc {
            static sum(@type(integerType) first: number, @restType(integerType) ...rest: number[]): number {
                return [first, ...rest].reduce((prev, curr) => prev + curr, 0);
            }
        }
        expect(RestCalc.sum(1, 2, 3, 4, 5)).toBe(15);
        expect(() => RestCalc.sum(1, 2, 3, 4.5, 5)).toThrow(
            "static RestCalc.sum(...): Argument #3: Must be a safe integer"
        );
    });
});
