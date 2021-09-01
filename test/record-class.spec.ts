import { 
    booleanType, 
    recordClassType, 
    RecordClass, 
    recordType, 
    stringType, 
    Type, 
    TypeOf, 
    unionType,
} from "../src";

describe("Record", () => {
    class TextStyle extends RecordClass(recordType({
        bold: booleanType,
        italic: booleanType,
        strike: booleanType,
        underline: booleanType,
    }).asPartial()) {}

    it("exposes properties", () => {
        const obj = new TextStyle({bold: true, italic: false, underline: undefined});
        expect(obj.bold).toBe(true);
        expect(obj.get("bold")).toBe(true);
        expect(obj.has("bold")).toBe(true);
        expect(obj.has("bold", true)).toBe(true);

        expect(obj.italic).toBe(false);
        expect(obj.get("italic")).toBe(false);
        expect(obj.has("italic")).toBe(true);
        expect(obj.has("italic", true)).toBe(false);

        expect(obj.strike).toBeUndefined();
        expect(obj.get("strike")).toBeUndefined();
        expect(obj.has("strike")).toBe(false);
        expect(obj.has("strike", undefined)).toBe(false);

        expect(obj.underline).toBeUndefined();
        expect(obj.get("underline")).toBeUndefined();
        expect(obj.has("underline")).toBe(false);
        expect(obj.has("underline", undefined)).toBe(false);
    });

    it("copy keeps the prototype chain", () => {
        const original = new TextStyle({});
        const modified = original.set("bold", true);
        expect(modified).toBeInstanceOf(TextStyle);
    });

    it("setting same value returns the same instance", () => {
        const original = new TextStyle({ bold: true });
        const modified = original.set("bold", true);
        expect(modified).toBe(original);
    });

    it("setting other value returns other instance", () => {
        const original = new TextStyle({ bold: true });
        const modified = original.set("bold", false);
        expect(modified).not.toBe(original);
        expect(original.bold).toBe(true);
        expect(modified.bold).toBe(false);
    });

    it("cannot be constructed with bad prop", () => {
        expect(() => new TextStyle({ bold: "bad" as unknown as boolean })).toThrow(
            "new TextStyle(...): Invalid argument: bold: Must be a boolean"
        );
    });

    it("cannot be constructed without required prop", () => {
        const R = RecordClass(recordType({ bold: booleanType }));
        expect(() => new R({} as unknown as { bold: boolean })).toThrowError(
            "new Record(...): Invalid argument: Missing required property: bold",
        );
    });

    it("undeclared props are ignored by constructor", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = new TextStyle({ other: true } as any);
        expect(obj.has("other")).toBe(false);
    });

    it("can set property", () => {
        const original = new TextStyle({bold: true, italic: false});
        const modified = original.set("italic", true);
        expect(modified.equals({ bold: true, italic: true })).toBe(true);
    });

    it("cannot set unknown property", () => {
        const obj = new TextStyle({});
        expect(() => obj.set("other" as "bold", true)).toThrowError(
            "Cannot set unknown property: other"
        );
    });

    it("cannot set bad property value", () => {
        const obj = new TextStyle({});
        expect(() => obj.set("bold", 1 as unknown as boolean)).toThrowError(
            "Invalid value for property: bold: Must be a boolean"
        );
    });

    it("can merge properties", () => {
        const original = new TextStyle({bold: true, italic: true});
        const modified = original.merge({bold: false, underline: true});
        expect(modified.equals({bold: false, italic: true, underline: true})).toBe(true);
    });

    it("can unmerge properties", () => {
        const original = new TextStyle({bold: true, italic: true, strike: true});
        const modified = original.unmerge({bold: false, italic: true, underline: true});
        expect(modified.equals({bold: true, strike: true})).toBe(true);
    });

    it("can unset properties", () => {
        const original = new TextStyle({bold: true, italic: true});
        const modified = original.unset("bold", "underline");
        expect(modified.equals({italic: true})).toBe(true);
    });

    it("cannot unset required property", () => {
        const R = RecordClass(recordType({ bold: booleanType, italic: booleanType }).withOptional("italic"));
        const r = new R({ bold: true, italic: true });
        expect(r.italic).toBeDefined();
        expect(r.unset("italic").italic).toBeUndefined();
        expect(() => r.unset("bold" as "italic")).toThrow("Cannot unset required property: bold");
    });

    it("can be created with data conversion", () => {
        const propsType = recordType({ chars: stringType, bold: booleanType });
        const dataType = unionType(stringType, propsType);
        class R extends RecordClass(
            propsType,
            dataType,
            data => typeof data === "string" ? ({ chars: data, bold: false }) : data,
            props => props.bold ? props : props.chars,
        ) {
            constructor (input: TypeOf<typeof dataType> = "") {
                super(input);
            }
        }
        expect(new R().toData()).toBe("");
        const complex = { chars: "abc", bold: true };
        expect(new R(complex)).toMatchObject(complex);
        expect(R.propsType).toBe(propsType);
        expect(R.dataType).toBe(dataType);
    });

    it("can assign class type", () => {
        class R extends RecordClass(recordType({ myProp: booleanType})) {
            static readonly classType = recordClassType(() => R);
        }
        expect(R.classType.test(new R({ myProp: true }))).toBe(true);
    });

    it("cannot overwrite method with prop", () => {
        class R extends RecordClass(recordType({ merge: booleanType })) {}
        const r = new R({ merge: true });
        expect(typeof r.merge).toBe("function");
        expect(r.get("merge")).toBe(true);
    });
});
