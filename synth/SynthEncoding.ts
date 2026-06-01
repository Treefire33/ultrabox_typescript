import { 
    
    
    
    
    Envelope
    
    
    
    } from "./SynthConfig";
import { base64CharCodeToInt, base64IntToCharCode } from "./Utilities";

export const enum CharCode {
    SPACE = 32,
    HASH = 35,
    PERCENT = 37,
    AMPERSAND = 38,
    PLUS = 43,
    DASH = 45,
    DOT = 46,
    NUM_0 = 48,
    NUM_1 = 49,
    NUM_2 = 50,
    NUM_3 = 51,
    NUM_4 = 52,
    NUM_5 = 53,
    NUM_6 = 54,
    NUM_7 = 55,
    NUM_8 = 56,
    NUM_9 = 57,
    EQUALS = 61,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    UNDERSCORE = 95,
    a = 97,
    b = 98,
    c = 99,
    d = 100,
    e = 101,
    f = 102,
    g = 103,
    h = 104,
    i = 105,
    j = 106,
    k = 107,
    l = 108,
    m = 109,
    n = 110,
    o = 111,
    p = 112,
    q = 113,
    r = 114,
    s = 115,
    t = 116,
    u = 117,
    v = 118,
    w = 119,
    x = 120,
    y = 121,
    z = 122,
    LEFT_CURLY_BRACE = 123,
    RIGHT_CURLY_BRACE = 125,
}
// const enum LegacySongTagCode {
//     beatCount           = CharCode.a, // added in BeepBox URL version 2
// 	bars                = CharCode.b, // added in BeepBox URL version 2
// 	vibrato             = CharCode.c, // added in BeepBox URL version 2, DEPRECATED
// 	fadeInOut           = CharCode.d, // added in BeepBox URL version 3 for transition, switched to fadeInOut in 9
// 	loopEnd             = CharCode.e, // added in BeepBox URL version 2
// 	eqFilter            = CharCode.f, // added in BeepBox URL version 3
// 	barCount            = CharCode.g, // added in BeepBox URL version 3
// 	unison              = CharCode.h, // added in BeepBox URL version 2
// 	instrumentCount     = CharCode.i, // added in BeepBox URL version 3
// 	patternCount        = CharCode.j, // added in BeepBox URL version 3
// 	key                 = CharCode.k, // added in BeepBox URL version 2
// 	loopStart           = CharCode.l, // added in BeepBox URL version 2
// 	reverb              = CharCode.m, // added in BeepBox URL version 5, DEPRECATED
// 	channelCount        = CharCode.n, // added in BeepBox URL version 6
// 	channelOctave       = CharCode.o, // added in BeepBox URL version 3
// 	patterns            = CharCode.p, // added in BeepBox URL version 2
// 	effects             = CharCode.q, // added in BeepBox URL version 7
// 	rhythm              = CharCode.r, // added in BeepBox URL version 2
// 	scale               = CharCode.s, // added in BeepBox URL version 2
// 	tempo               = CharCode.t, // added in BeepBox URL version 2
// 	preset              = CharCode.u, // added in BeepBox URL version 7
// 	volume              = CharCode.v, // added in BeepBox URL version 2
// 	wave                = CharCode.w, // added in BeepBox URL version 2
// 	supersaw            = CharCode.x, // added in BeepBox URL version 9 ([UB] was used for chip wave but is now DEPRECATED)
// 	filterResonance     = CharCode.y, // added in BeepBox URL version 7, DEPRECATED, [UB] repurposed for chip wave loop controls
// 	drumsetEnvelopes    = CharCode.z, // added in BeepBox URL version 7 for filter envelopes, still used for drumset envelopes
// 	algorithm           = CharCode.A, // added in BeepBox URL version 6
// 	feedbackAmplitude   = CharCode.B, // added in BeepBox URL version 6
// 	chord               = CharCode.C, // added in BeepBox URL version 7, DEPRECATED
// 	detune              = CharCode.D, // added in JummBox URL version 3(?) for detune, DEPRECATED
// 	envelopes           = CharCode.E, // added in BeepBox URL version 6 for FM operator envelopes, repurposed in 9 for general envelopes.
// 	feedbackType        = CharCode.F, // added in BeepBox URL version 6
// 	arpeggioSpeed       = CharCode.G, // added in JummBox URL version 3 for arpeggioSpeed, DEPRECATED
// 	harmonics           = CharCode.H, // added in BeepBox URL version 7
// 	stringSustain       = CharCode.I, // added in BeepBox URL version 9
// //	                    = CharCode.J,
// //	                    = CharCode.K,
// 	pan                 = CharCode.L, // added between 8 and 9, DEPRECATED
// 	customChipWave      = CharCode.M, // added in JummBox URL version 1(?) for customChipWave
// 	songTitle           = CharCode.N, // added in JummBox URL version 1(?) for songTitle
// 	limiterSettings     = CharCode.O, // added in JummBox URL version 3(?) for limiterSettings
// 	operatorAmplitudes  = CharCode.P, // added in BeepBox URL version 6
// 	operatorFrequencies = CharCode.Q, // added in BeepBox URL version 6
// 	operatorWaves       = CharCode.R, // added in JummBox URL version 4 for operatorWaves
// 	spectrum            = CharCode.S, // added in BeepBox URL version 7
// 	startInstrument     = CharCode.T, // added in BeepBox URL version 6
// 	channelNames        = CharCode.U, // added in JummBox URL version 4(?) for channelNames
// 	feedbackEnvelope    = CharCode.V, // added in BeepBox URL version 6, DEPRECATED
// 	pulseWidth          = CharCode.W, // added in BeepBox URL version 7
// 	aliases             = CharCode.X, // added in JummBox URL version 4 for aliases, DEPRECATED, [UB] repurposed for PWM decimal offset (DEPRECATED as well)
// //	                    = CharCode.Y,
// //	                    = CharCode.Z,
// //	                    = CharCode.NUM_0,
// //	                    = CharCode.NUM_1,
// //	                    = CharCode.NUM_2,
// //	                    = CharCode.NUM_3,
// //	                    = CharCode.NUM_4,
// //	                    = CharCode.NUM_5,
// //	                    = CharCode.NUM_6,
// //	                    = CharCode.NUM_7,
// //	                    = CharCode.NUM_8,
// //	                    = CharCode.NUM_9,
// //	                    = CharCode.DASH,
// //	                    = CharCode.UNDERSCORE,

// }
export const enum SongTagCode {
    beatCount           = CharCode.a, // added in BeepBox URL version 2
	bars                = CharCode.b, // added in BeepBox URL version 2
	vibrato             = CharCode.c, // added in BeepBox URL version 2, DEPRECATED
	fadeInOut           = CharCode.d, // added in BeepBox URL version 3 for transition, switched to fadeInOut in 9
	loopEnd             = CharCode.e, // added in BeepBox URL version 2
	eqFilter            = CharCode.f, // added in BeepBox URL version 3
	barCount            = CharCode.g, // added in BeepBox URL version 3
	unison              = CharCode.h, // added in BeepBox URL version 2
	instrumentCount     = CharCode.i, // added in BeepBox URL version 3
	patternCount        = CharCode.j, // added in BeepBox URL version 3
	key                 = CharCode.k, // added in BeepBox URL version 2
	loopStart           = CharCode.l, // added in BeepBox URL version 2
	reverb              = CharCode.m, // added in BeepBox URL version 5, DEPRECATED
	channel             = CharCode.n, // LeafBox channel declaration
	channelPosition     = CharCode.o, // LeafBox channel index (position)
	patterns            = CharCode.p, // added in BeepBox URL version 2
	effects             = CharCode.q, // added in BeepBox URL version 7
	rhythm              = CharCode.r, // added in BeepBox URL version 2
	scale               = CharCode.s, // added in BeepBox URL version 2
	tempo               = CharCode.t, // added in BeepBox URL version 2
	preset              = CharCode.u, // added in BeepBox URL version 7
	volume              = CharCode.v, // added in BeepBox URL version 2
	wave                = CharCode.w, // added in BeepBox URL version 2
	supersaw            = CharCode.x, // added in BeepBox URL version 9 ([UB] was used for chip wave but is now DEPRECATED)
	chipLoopControls    = CharCode.y, // added in BeepBox URL version 7, DEPRECATED, [UB] repurposed for chip wave loop controls
	drumsetEnvelopes    = CharCode.z, // added in BeepBox URL version 7 for filter envelopes, still used for drumset envelopes
	algorithm           = CharCode.A, // added in BeepBox URL version 6
	feedbackAmplitude   = CharCode.B, // added in BeepBox URL version 6
	chord               = CharCode.C, // added in BeepBox URL version 7, DEPRECATED
	detune              = CharCode.D, // added in JummBox URL version 3(?) for detune, DEPRECATED
	envelopes           = CharCode.E, // added in BeepBox URL version 6 for FM operator envelopes, repurposed in 9 for general envelopes.
	feedbackType        = CharCode.F, // added in BeepBox URL version 6
	arpeggioSpeed       = CharCode.G, // added in JummBox URL version 3 for arpeggioSpeed, DEPRECATED
	harmonics           = CharCode.H, // added in BeepBox URL version 7
	stringSustain       = CharCode.I, // added in BeepBox URL version 9
//	                    = CharCode.J,
//	                    = CharCode.K,
	pan                 = CharCode.L, // added between 8 and 9, DEPRECATED
	customChipWave      = CharCode.M, // added in JummBox URL version 1(?) for customChipWave
	songTitle           = CharCode.N, // added in JummBox URL version 1(?) for songTitle
	limiterSettings     = CharCode.O, // added in JummBox URL version 3(?) for limiterSettings
	operatorAmplitudes  = CharCode.P, // added in BeepBox URL version 6
	operatorFrequencies = CharCode.Q, // added in BeepBox URL version 6
	operatorWaves       = CharCode.R, // added in JummBox URL version 4 for operatorWaves
	spectrum            = CharCode.S, // added in BeepBox URL version 7
	startInstrument     = CharCode.T, // added in BeepBox URL version 6
	channelName         = CharCode.U, // LeafBox channel name
	feedbackEnvelope    = CharCode.V, // added in BeepBox URL version 6, DEPRECATED
	pulseWidth          = CharCode.W, // added in BeepBox URL version 7
	aliases             = CharCode.X, // added in JummBox URL version 4 for aliases, DEPRECATED, [UB] repurposed for PWM decimal offset (DEPRECATED as well)
    channelOctave	    = CharCode.Y, // moved from CharCode.o because I can't plan well
    channelInst         = CharCode.Z, // LeafBox channel instrument count
//	                    = CharCode.NUM_0,
//	                    = CharCode.NUM_1,
//	                    = CharCode.NUM_2,
//	                    = CharCode.NUM_3,
//	                    = CharCode.NUM_4,
//	                    = CharCode.NUM_5,
//	                    = CharCode.NUM_6,
//	                    = CharCode.NUM_7,
//	                    = CharCode.NUM_8,
//	                    = CharCode.NUM_9,
//	                    = CharCode.DASH,
//	                    = CharCode.UNDERSCORE,

}
export const enum BeepBoxModType {
    BeepBox, 
    DogeBox = 0x64,
    GoldBox = 0x67,
    JummBox = 0x6A,
    LeafBox = 0x6C,
    UltraBox = 0x75,
    Unknown
}

export class BitFieldReader {
    private _bits: number[] = [];
    private _readIndex: number = 0;

    constructor(source: string, startIndex: number, stopIndex: number) {
        for (let i: number = startIndex; i < stopIndex; i++) {
            const value: number = base64CharCodeToInt[source.charCodeAt(i)];
            this._bits.push((value >> 5) & 0x1);
            this._bits.push((value >> 4) & 0x1);
            this._bits.push((value >> 3) & 0x1);
            this._bits.push((value >> 2) & 0x1);
            this._bits.push((value >> 1) & 0x1);
            this._bits.push(value & 0x1);
        }
    }

    public read(bitCount: number): number {
        let result: number = 0;
        while (bitCount > 0) {
            result = result << 1;
            result += this._bits[this._readIndex++];
            bitCount--;
        }
        return result;
    }

    public readLongTail(minValue: number, minBits: number): number {
        let result: number = minValue;
        let numBits: number = minBits;
        while (this._bits[this._readIndex++]) {
            result += 1 << numBits;
            numBits++;
        }
        while (numBits > 0) {
            numBits--;
            if (this._bits[this._readIndex++]) {
                result += 1 << numBits;
            }
        }
        return result;
    }

    public readPartDuration(): number {
        return this.readLongTail(1, 3);
    }

    public readLegacyPartDuration(): number {
        return this.readLongTail(1, 2);
    }

    public readPinCount(): number {
        return this.readLongTail(1, 0);
    }

    public readPitchInterval(): number {
        if (this.read(1)) {
            return -this.readLongTail(1, 3);
        } else {
            return this.readLongTail(1, 3);
        }
    }
}

export class BitFieldWriter {
    private _index: number = 0;
    private _bits: number[] = [];

    public clear() {
        this._index = 0;
    }

    public write(bitCount: number, value: number): void {
        bitCount--;
        while (bitCount >= 0) {
            this._bits[this._index++] = (value >>> bitCount) & 1;
            bitCount--;
        }
    }

    public writeLongTail(minValue: number, minBits: number, value: number): void {
        if (value < minValue) throw new Error("value out of bounds");
        value -= minValue;
        let numBits: number = minBits;
        while (value >= (1 << numBits)) {
            this._bits[this._index++] = 1;
            value -= 1 << numBits;
            numBits++;
        }
        this._bits[this._index++] = 0;
        while (numBits > 0) {
            numBits--;
            this._bits[this._index++] = (value >>> numBits) & 1;
        }
    }

    public writePartDuration(value: number): void {
        this.writeLongTail(1, 3, value);
    }

    public writePinCount(value: number): void {
        this.writeLongTail(1, 0, value);
    }

    public writePitchInterval(value: number): void {
        if (value < 0) {
            this.write(1, 1); // sign
            this.writeLongTail(1, 3, -value);
        } else {
            this.write(1, 0); // sign
            this.writeLongTail(1, 3, value);
        }
    }

    public concat(other: BitFieldWriter): void {
        for (let i: number = 0; i < other._index; i++) {
            this._bits[this._index++] = other._bits[i];
        }
    }

    public encodeBase64(buffer: number[]): number[] {

        for (let i: number = 0; i < this._index; i += 6) {
            const value: number = (this._bits[i] << 5) | (this._bits[i + 1] << 4) | (this._bits[i + 2] << 3) | (this._bits[i + 3] << 2) | (this._bits[i + 4] << 1) | this._bits[i + 5];
            buffer.push(base64IntToCharCode[value]);
        }
        return buffer;
    }

    public lengthBase64(): number {
        return Math.ceil(this._index / 6);
    }
}

// Settings that were available to old versions of BeepBox but are no longer available in the
// current version that need to be reinterpreted as a group to determine the best way to
// represent them in the current version.
export interface LegacySettings {
    filterCutoff?: number;
    filterResonance?: number;
    filterEnvelope?: Envelope;
    pulseEnvelope?: Envelope;
    operatorEnvelopes?: Envelope[];
    feedbackEnvelope?: Envelope;
}
