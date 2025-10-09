import { describe, expect, it } from "vitest"
import { initializeContainer } from "./initializeContainer";
import { Container } from "inversify";

describe('initializeContainer', () => {
    it("initializes the container correctly", () => {
        const container = initializeContainer();
        expect(container).toBeInstanceOf(Container);
    });
});