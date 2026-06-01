import { Config } from "./SynthConfig";

export class CustomFeedBack {
    public name: string = "";
    public indices: number[][] = [[], [], [], [], [], []];

    constructor() {
        this.fromPreset(1);
    }

    public set(inIndices: number[][]) {
        this.reset();
        for (let i = 0; i < this.indices.length; i++) {
            this.indices[i] = inIndices[i];
            for (let j = 0; j < inIndices[i].length; j++) {
                this.name += inIndices[i][j];
                this.name += ",";
            }
            this.name += ".";
        }
    }

    public reset(): void {
        this.reset;
        this.name = "";
        this.indices = [[1], [], [], [], [], []];
    }

    public copy(other: CustomFeedBack): void {
        this.name = other.name;
        this.indices = other.indices;
    }

    public fromPreset(other: number): void {
        this.reset();
        let preset = Config.feedbacks6Op[other];
        for (var i = 0; i < preset.indices.length; i++) {
            this.indices[i] = Array.from(preset.indices[i]);
            for (let j = 0; j < preset.indices[i].length; j++) {
                this.name += preset.indices[i][j];
                this.name += ",";
            }
            this.name += ".";
        }
    }
}
