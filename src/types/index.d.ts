// This file contains TypeScript type definitions for the project, providing type information for various objects and functions used in the game.

declare module 'flightYoke' {
    export interface FlightYokeInput {
        pitch: number;
        roll: number;
        throttle: number;
        rudder: number;
    }

    export function getFlightYokeInput(): FlightYokeInput;
}

declare module 'airplane' {
    export class Airplane {
        constructor();
        updatePosition(input: FlightYokeInput): void;
        getPosition(): { x: number; y: number; z: number };
    }
}

declare module 'world' {
    export class World {
        constructor();
        render(): void;
    }
}

declare module 'camera' {
    export class Camera {
        constructor();
        update(position: { x: number; y: number; z: number }): void;
        getViewMatrix(): number[];
    }
}

declare module 'hud' {
    export class HUD {
        constructor();
        update(speed: number, altitude: number): void;
        render(): void;
    }
}