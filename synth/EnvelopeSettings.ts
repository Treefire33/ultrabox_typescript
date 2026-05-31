
export class EnvelopeSettings {
    public target: number = 0;
    public index: number = 0;
    public envelope: number = 0;

    constructor() {
        this.reset();
    }

    reset(): void {
        this.target = 0;
        this.index = 0;
        this.envelope = 0;
    }

    public toJsonObject(): Object {
        const envelopeObject: any = {
            "target": Config.instrumentAutomationTargets[this.target].name,
            "envelope": Config.envelopes[this.envelope].name,
        };
        if (Config.instrumentAutomationTargets[this.target].maxCount > 1) {
            envelopeObject["index"] = this.index;
        }
        return envelopeObject;
    }

    public fromJsonObject(envelopeObject: any): void {
        this.reset();

        let target: AutomationTarget = Config.instrumentAutomationTargets.dictionary[envelopeObject["target"]];
        if (target == null) target = Config.instrumentAutomationTargets.dictionary["noteVolume"];
        this.target = target.index;

        let envelope: Envelope = Config.envelopes.dictionary[envelopeObject["envelope"]];
        if (envelope == null) envelope = Config.envelopes.dictionary["none"];
        this.envelope = envelope.index;

        if (envelopeObject["index"] != undefined) {
            this.index = clamp(0, Config.instrumentAutomationTargets[this.target].maxCount, envelopeObject["index"] | 0);
        } else {
            this.index = 0;
        }
    }
}
