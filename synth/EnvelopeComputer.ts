import { EnvelopeSettings } from "./EnvelopeSettings";
import { FilterSettings } from "./FilterSettings";
import { Tone } from "./Tone";

export class EnvelopeComputer {
    // "Unscaled" values do not increase with Envelope Speed's timescale factor. Thus they are "real" seconds since the start of the note.
    // Fade envelopes notable use unscaled values instead of being ties to Envelope Speed.
    public noteSecondsStart: number = 0.0;
    public noteSecondsStartUnscaled: number = 0.0;
    public noteSecondsEnd: number = 0.0;
    public noteSecondsEndUnscaled: number = 0.0;
    public noteTicksStart: number = 0.0;
    public noteTicksEnd: number = 0.0;
    public noteSizeStart: number = Config.noteSizeMax;
    public noteSizeEnd: number = Config.noteSizeMax;
    public prevNoteSize: number = Config.noteSizeMax;
    public nextNoteSize: number = Config.noteSizeMax;
    private _noteSizeFinal: number = Config.noteSizeMax;
    public prevNoteSecondsStart: number = 0.0;
    public prevNoteSecondsStartUnscaled: number = 0.0;
    public prevNoteSecondsEnd: number = 0.0;
    public prevNoteSecondsEndUnscaled: number = 0.0;
    public prevNoteTicksStart: number = 0.0;
    public prevNoteTicksEnd: number = 0.0;
    private _prevNoteSizeFinal: number = Config.noteSizeMax;

    public prevSlideStart: boolean = false;
    public prevSlideEnd: boolean = false;
    public nextSlideStart: boolean = false;
    public nextSlideEnd: boolean = false;
    public prevSlideRatioStart: number = 0.0;
    public prevSlideRatioEnd: number = 0.0;
    public nextSlideRatioStart: number = 0.0;
    public nextSlideRatioEnd: number = 0.0;

    public readonly envelopeStarts: number[] = [];
    public readonly envelopeEnds: number[] = [];
    private readonly _modifiedEnvelopeIndices: number[] = [];
    private _modifiedEnvelopeCount: number = 0;
    public lowpassCutoffDecayVolumeCompensation: number = 1.0;

    constructor( /*private _perNote: boolean*/) {
        //const length: number = this._perNote ? EnvelopeComputeIndex.length : InstrumentAutomationIndex.length;
        const length: number = EnvelopeComputeIndex.length;
        for (let i: number = 0; i < length; i++) {
            this.envelopeStarts[i] = 1.0;
            this.envelopeEnds[i] = 1.0;
        }

        this.reset();
    }

    public reset(): void {
        this.noteSecondsEnd = 0.0;
        this.noteSecondsEndUnscaled = 0.0;
        this.noteTicksEnd = 0.0;
        this._noteSizeFinal = Config.noteSizeMax;
        this.prevNoteSecondsEnd = 0.0;
        this.prevNoteSecondsEndUnscaled = 0.0;
        this.prevNoteTicksEnd = 0.0;
        this._prevNoteSizeFinal = Config.noteSizeMax;
        this._modifiedEnvelopeCount = 0;
    }

    public computeEnvelopes(instrument: Instrument, currentPart: number, tickTimeStart: number, tickTimeStartReal: number, secondsPerTick: number, tone: Tone | null, timeScale: number): void {
        const secondsPerTickUnscaled: number = secondsPerTick;
        secondsPerTick *= timeScale;
        const transition: Transition = instrument.getTransition();
        if (tone != null && tone.atNoteStart && !transition.continues && !tone.forceContinueAtStart) {
            this.prevNoteSecondsEnd = this.noteSecondsEnd;
            this.prevNoteSecondsEndUnscaled = this.noteSecondsEndUnscaled;
            this.prevNoteTicksEnd = this.noteTicksEnd;
            this._prevNoteSizeFinal = this._noteSizeFinal;
            this.noteSecondsEnd = 0.0;
            this.noteSecondsEndUnscaled = 0.0;
            this.noteTicksEnd = 0.0;
        }
        if (tone != null) {
            if (tone.note != null) {
                this._noteSizeFinal = tone.note.pins[tone.note.pins.length - 1].size;
            } else {
                this._noteSizeFinal = Config.noteSizeMax;
            }
        }
        const tickTimeEnd: number = tickTimeStart + timeScale;
        const tickTimeEndReal: number = tickTimeStartReal + 1.0;
        const noteSecondsStart: number = this.noteSecondsEnd;
        const noteSecondsStartUnscaled: number = this.noteSecondsEndUnscaled;
        const noteSecondsEnd: number = noteSecondsStart + secondsPerTick;
        const noteSecondsEndUnscaled: number = noteSecondsStartUnscaled + secondsPerTickUnscaled;
        const noteTicksStart: number = this.noteTicksEnd;
        const noteTicksEnd: number = noteTicksStart + 1.0;
        const prevNoteSecondsStart: number = this.prevNoteSecondsEnd;
        const prevNoteSecondsStartUnscaled: number = this.prevNoteSecondsEndUnscaled;
        const prevNoteSecondsEnd: number = prevNoteSecondsStart + secondsPerTick;
        const prevNoteSecondsEndUnscaled: number = prevNoteSecondsStartUnscaled + secondsPerTickUnscaled;
        const prevNoteTicksStart: number = this.prevNoteTicksEnd;
        const prevNoteTicksEnd: number = prevNoteTicksStart + 1.0;

        const beatsPerTick: number = 1.0 / (Config.ticksPerPart * Config.partsPerBeat);
        const beatTimeStart: number = beatsPerTick * tickTimeStart;
        const beatTimeEnd: number = beatsPerTick * tickTimeEnd;

        let noteSizeStart: number = this._noteSizeFinal;
        let noteSizeEnd: number = this._noteSizeFinal;
        let prevNoteSize: number = this._prevNoteSizeFinal;
        let nextNoteSize: number = 0;
        let prevSlideStart: boolean = false;
        let prevSlideEnd: boolean = false;
        let nextSlideStart: boolean = false;
        let nextSlideEnd: boolean = false;
        let prevSlideRatioStart: number = 0.0;
        let prevSlideRatioEnd: number = 0.0;
        let nextSlideRatioStart: number = 0.0;
        let nextSlideRatioEnd: number = 0.0;
        if (tone != null && tone.note != null && !tone.passedEndOfNote) {
            const endPinIndex: number = tone.note.getEndPinIndex(currentPart);
            const startPin: NotePin = tone.note.pins[endPinIndex - 1];
            const endPin: NotePin = tone.note.pins[endPinIndex];
            const startPinTick: number = (tone.note.start + startPin.time) * Config.ticksPerPart;
            const endPinTick: number = (tone.note.start + endPin.time) * Config.ticksPerPart;
            const ratioStart: number = (tickTimeStartReal - startPinTick) / (endPinTick - startPinTick);
            const ratioEnd: number = (tickTimeEndReal - startPinTick) / (endPinTick - startPinTick);
            noteSizeStart = startPin.size + (endPin.size - startPin.size) * ratioStart;
            noteSizeEnd = startPin.size + (endPin.size - startPin.size) * ratioEnd;

            if (transition.slides) {
                const noteStartTick: number = tone.noteStartPart * Config.ticksPerPart;
                const noteEndTick: number = tone.noteEndPart * Config.ticksPerPart;
                const noteLengthTicks: number = noteEndTick - noteStartTick;
                const maximumSlideTicks: number = noteLengthTicks * 0.5;
                const slideTicks: number = Math.min(maximumSlideTicks, transition.slideTicks);
                if (tone.prevNote != null && !tone.forceContinueAtStart) {
                    if (tickTimeStartReal - noteStartTick < slideTicks) {
                        prevSlideStart = true;
                        prevSlideRatioStart = 0.5 * (1.0 - (tickTimeStartReal - noteStartTick) / slideTicks);
                    }
                    if (tickTimeEndReal - noteStartTick < slideTicks) {
                        prevSlideEnd = true;
                        prevSlideRatioEnd = 0.5 * (1.0 - (tickTimeEndReal - noteStartTick) / slideTicks);
                    }
                }
                if (tone.nextNote != null && !tone.forceContinueAtEnd) {
                    nextNoteSize = tone.nextNote.pins[0].size;
                    if (noteEndTick - tickTimeStartReal < slideTicks) {
                        nextSlideStart = true;
                        nextSlideRatioStart = 0.5 * (1.0 - (noteEndTick - tickTimeStartReal) / slideTicks);
                    }
                    if (noteEndTick - tickTimeEndReal < slideTicks) {
                        nextSlideEnd = true;
                        nextSlideRatioEnd = 0.5 * (1.0 - (noteEndTick - tickTimeEndReal) / slideTicks);
                    }
                }
            }
        }

        let lowpassCutoffDecayVolumeCompensation: number = 1.0;
        let usedNoteSize: boolean = false;
        for (let envelopeIndex: number = 0; envelopeIndex <= instrument.envelopeCount; envelopeIndex++) {
            let automationTarget: AutomationTarget;
            let targetIndex: number;
            let envelope: Envelope;
            if (envelopeIndex == instrument.envelopeCount) {
                if (usedNoteSize /*|| !this._perNote*/) break;
                // Special case: if no other envelopes used note size, default to applying it to note volume.
                automationTarget = Config.instrumentAutomationTargets.dictionary["noteVolume"];
                targetIndex = 0;
                envelope = Config.envelopes.dictionary["note size"];
            } else {
                let envelopeSettings: EnvelopeSettings = instrument.envelopes[envelopeIndex];
                automationTarget = Config.instrumentAutomationTargets[envelopeSettings.target];
                targetIndex = envelopeSettings.index;
                envelope = Config.envelopes[envelopeSettings.envelope];
                if (envelope.type == EnvelopeType.noteSize) usedNoteSize = true;
            }
            if ( /*automationTarget.perNote == this._perNote &&*/automationTarget.computeIndex != null) {
                const computeIndex: number = automationTarget.computeIndex + targetIndex;
                let envelopeStart: number = EnvelopeComputer.computeEnvelope(envelope, noteSecondsStart, beatTimeStart, noteSizeStart);
                if (prevSlideStart) {
                    const other: number = EnvelopeComputer.computeEnvelope(envelope, prevNoteSecondsStart, beatTimeStart, prevNoteSize);
                    envelopeStart += (other - envelopeStart) * prevSlideRatioStart;
                }
                if (nextSlideStart) {
                    const other: number = EnvelopeComputer.computeEnvelope(envelope, 0.0, beatTimeStart, nextNoteSize);
                    envelopeStart += (other - envelopeStart) * nextSlideRatioStart;
                }
                let envelopeEnd: number = envelopeStart;
                if (instrument.discreteEnvelope == false) {
                    envelopeEnd = EnvelopeComputer.computeEnvelope(envelope, noteSecondsEnd, beatTimeEnd, noteSizeEnd);
                    if (prevSlideEnd) {
                        const other: number = EnvelopeComputer.computeEnvelope(envelope, prevNoteSecondsEnd, beatTimeEnd, prevNoteSize);
                        envelopeEnd += (other - envelopeEnd) * prevSlideRatioEnd;
                    }
                    if (nextSlideEnd) {
                        const other: number = EnvelopeComputer.computeEnvelope(envelope, 0.0, beatTimeEnd, nextNoteSize);
                        envelopeEnd += (other - envelopeEnd) * nextSlideRatioEnd;
                    }
                }

                this.envelopeStarts[computeIndex] *= envelopeStart;
                this.envelopeEnds[computeIndex] *= envelopeEnd;
                this._modifiedEnvelopeIndices[this._modifiedEnvelopeCount++] = computeIndex;

                if (automationTarget.isFilter) {
                    const filterSettings: FilterSettings = /*this._perNote ?*/ (instrument.tmpNoteFilterStart != null) ? instrument.tmpNoteFilterStart : instrument.noteFilter /*: instrument.eqFilter*/;
                    if (filterSettings.controlPointCount > targetIndex && filterSettings.controlPoints[targetIndex].type == FilterType.lowPass) {
                        lowpassCutoffDecayVolumeCompensation = Math.max(lowpassCutoffDecayVolumeCompensation, EnvelopeComputer.getLowpassCutoffDecayVolumeCompensation(envelope));
                    }
                }
            }
        }

        this.noteSecondsStart = noteSecondsStart;
        this.noteSecondsStartUnscaled = noteSecondsStartUnscaled;
        this.noteSecondsEnd = noteSecondsEnd;
        this.noteSecondsEndUnscaled = noteSecondsEndUnscaled;
        this.noteTicksStart = noteTicksStart;
        this.noteTicksEnd = noteTicksEnd;
        this.prevNoteSecondsStart = prevNoteSecondsStart;
        this.prevNoteSecondsStartUnscaled = prevNoteSecondsStartUnscaled;
        this.prevNoteSecondsEnd = prevNoteSecondsEnd;
        this.prevNoteSecondsEndUnscaled = prevNoteSecondsEndUnscaled;
        this.prevNoteTicksStart = prevNoteTicksStart;
        this.prevNoteTicksEnd = prevNoteTicksEnd;
        this.prevNoteSize = prevNoteSize;
        this.nextNoteSize = nextNoteSize;
        this.noteSizeStart = noteSizeStart;
        this.noteSizeEnd = noteSizeEnd;
        this.prevSlideStart = prevSlideStart;
        this.prevSlideEnd = prevSlideEnd;
        this.nextSlideStart = nextSlideStart;
        this.nextSlideEnd = nextSlideEnd;
        this.prevSlideRatioStart = prevSlideRatioStart;
        this.prevSlideRatioEnd = prevSlideRatioEnd;
        this.nextSlideRatioStart = nextSlideRatioStart;
        this.nextSlideRatioEnd = nextSlideRatioEnd;
        this.lowpassCutoffDecayVolumeCompensation = lowpassCutoffDecayVolumeCompensation;
    }

    public clearEnvelopes(): void {
        for (let envelopeIndex: number = 0; envelopeIndex < this._modifiedEnvelopeCount; envelopeIndex++) {
            const computeIndex: number = this._modifiedEnvelopeIndices[envelopeIndex];
            this.envelopeStarts[computeIndex] = 1.0;
            this.envelopeEnds[computeIndex] = 1.0;
        }
        this._modifiedEnvelopeCount = 0;
    }

    public static computeEnvelope(envelope: Envelope, time: number, beats: number, noteSize: number): number {
        switch (envelope.type) {
            case EnvelopeType.noteSize: return Synth.noteSizeToVolumeMult(noteSize);
            case EnvelopeType.none: return 1.0;
            case EnvelopeType.twang: return 1.0 / (1.0 + time * envelope.speed);
            case EnvelopeType.swell: return 1.0 - 1.0 / (1.0 + time * envelope.speed);
            case EnvelopeType.tremolo: return 0.5 - Math.cos(beats * 2.0 * Math.PI * envelope.speed) * 0.5;
            case EnvelopeType.tremolo2: return 0.75 - Math.cos(beats * 2.0 * Math.PI * envelope.speed) * 0.25;
            case EnvelopeType.punch: return Math.max(1.0, 2.0 - time * 10.0);
            case EnvelopeType.flare: const attack: number = 0.25 / Math.sqrt(envelope.speed); return time < attack ? time / attack : 1.0 / (1.0 + (time - attack) * envelope.speed);
            case EnvelopeType.decay: return Math.pow(2, -envelope.speed * time);
            case EnvelopeType.blip: return 1.0 * +(time < (0.25 / Math.sqrt(envelope.speed)));
            case EnvelopeType.wibble:
                let temp = 0.5 - Math.cos(beats * envelope.speed) * 0.5;
                temp = 1.0 / (1.0 + time * (envelope.speed - (temp / (1.5 / envelope.speed))));
                temp = temp > 0.0 ? temp : 0.0;
                return temp;
            case EnvelopeType.linear: {
                let lin = (1.0 - (time / (16 / envelope.speed)));
                lin = lin > 0.0 ? lin : 0.0;
                return lin;
            }
            case EnvelopeType.rise: {
                let lin = (time / (16 / envelope.speed));
                lin = lin < 1.0 ? lin : 1.0;
                return lin;
            }
            default: throw new Error("Unrecognized operator envelope type.");
        }

    }

    public static getLowpassCutoffDecayVolumeCompensation(envelope: Envelope): number {
        // This is a little hokey in the details, but I designed it a while ago and keep it 
        // around for compatibility. This decides how much to increase the volume (or
        // expression) to compensate for a decaying lowpass cutoff to maintain perceived
        // volume overall.
        if (envelope.type == EnvelopeType.decay) return 1.25 + 0.025 * envelope.speed;
        if (envelope.type == EnvelopeType.twang) return 1.0 + 0.02 * envelope.speed;
        return 1.0;
    }
}
