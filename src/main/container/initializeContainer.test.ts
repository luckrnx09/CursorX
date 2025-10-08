import { describe, expect, it } from "vitest"
import { initializeContainer } from "./initializeContainer";
import { SettingsManager } from "../core/SettingsManager";
import { OverlayManager } from "../core/OverlayManager";
import { CursorTracker } from "../core/CursorTracker";
import { Container } from "inversify";

describe('initializeContainer', () => {
    it("initializes the container correctly", () => {
        const container = initializeContainer();
        expect(container).toBeInstanceOf(Container);
    });
});