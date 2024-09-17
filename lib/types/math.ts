type Assert<A, _ extends A> = A;
type Cast<A, T = number> = A extends T ? A : never;

type Bit = 0 | 1;

type NOT<A extends Bit> = A extends 1 ? 0 : 1;

type AND<A extends Bit, B extends Bit> = [A, B] extends [1, 1] ? 1 : 0;

type OR<A extends Bit, B extends Bit> = [A, B] extends [0, 0] ? 0 : 1;

type XOR<A extends Bit, B extends Bit> = OR<AND<NOT<A>, B>, AND<NOT<B>, A>>;

type NOR<A extends Bit, B extends Bit> = NOT<OR<A, B>>;
type NAND<A extends Bit, B extends Bit> = NOT<AND<A, B>>;
type XNOR<A extends Bit, B extends Bit> = NOT<XOR<A, B>>;

type XOR3<A extends Bit, B extends Bit, C extends Bit> = XOR<XOR<A, B>, C>;

type FillTupleFront<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T : FillTupleFront<N, [0, ...T]>;
type FillTupleBack<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T : FillTupleBack<N, [...T, 0]>;

type ShiftLeft<T extends Bit[], N extends number = 1> = FillTupleBack<N, T>;

type HalfAdder<A extends Bit, B extends Bit> = [S: XOR<A, B>, C: AND<A, B>];

type FullAdder<A extends Bit, B extends Bit, C extends Bit> = [
  S: XOR<XOR<A, B>, C>,
  C: OR<AND<A, B>, AND<C, XOR<A, B>>>,
];

type NBitAdder<
  A extends readonly Bit[],
  B extends readonly Bit[],
  C extends Bit = 0,
> = [A, B] extends [
  [...infer HeadA extends Bit[], infer TailA extends Bit],
  [...infer HeadB extends Bit[], infer TailB extends Bit],
]
  ? [
      ...(FullAdder<TailA, TailB, C> extends [
        infer S extends Bit,
        infer Cout extends Bit,
      ]
        ? [...NBitAdder<HeadA, HeadB, Cout>, S]
        : never),
    ]
  : [];

type Test_NBitAdder_53_Plus_84_Eq_137 = Assert<
  NBitAdder<
    [0, 0, 1, 1, 0, 1, 0, 1], // 53
    [0, 1, 0, 1, 0, 1, 0, 0] // 84
  >,
  [1, 0, 0, 0, 1, 0, 0, 1] // 137
>;

type Add5Bit = NBitAdder<[0, 0, 1, 1, 0], [0, 1, 1, 1, 1]>;
// ^?

type Add4Bit = NBitAdder<[0, 1, 1, 1], [0, 1, 1, 1]>;
// ^?

type SizedTuple<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T : SizedTuple<N, [...T, 0]>;

type Add<A extends number, B extends number> = Cast<
  [...SizedTuple<A>, ...SizedTuple<B>]['length'],
  number
>;

type Multiply<
  A extends number,
  B extends number,
  T extends number[] = [A],
> = B extends 0
  ? 0
  : T['length'] extends B
    ? A
    : Multiply<Add<A, T[0]>, B, [...T, 0]>;

type Pow<
  N extends number,
  P extends number,
  T extends number[] = [N],
> = P extends 0
  ? 1
  : T['length'] extends P
    ? N
    : Pow<Multiply<N, T[0]>, P, [...T, N]>;

type Head<T extends Bit[]> = T extends [...infer Head extends Bit[], infer _]
  ? Head
  : never;
type Tail<T extends Bit[]> = T extends [...infer _, infer Tail extends Bit]
  ? Tail
  : never;

type ToDecimal<
  T extends Bit[],
  Acc extends number = 0,
  I extends number = 0,
> = T['length'] extends 0
  ? Acc
  : ToDecimal<
      Head<T>,
      Cast<Add<Acc, Tail<T> extends 1 ? Pow<2, I> : 0>>,
      Cast<Add<I, 1>>
    >;

type Test_53_Plus_84_Eq_137 = Assert<
  NBitAdder<
    [0, 0, 1, 1, 0, 1, 0, 1], // 53
    [0, 1, 0, 1, 0, 1, 0, 0] // 84
  >,
  [1, 0, 0, 0, 1, 0, 0, 1] // 137
>;

type Test_ToDecimal_137 = Assert<ToDecimal<[1, 0, 0, 0, 1, 0, 0, 1]>, 137>;

type UInt8 = [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit];
type AddUInt8<A extends UInt8, B extends UInt8> = NBitAdder<A, B>;

type Test_XOR3_000 = Assert<XOR3<0, 0, 0>, 0>;
type Test_XOR3_001 = Assert<XOR3<0, 0, 1>, 1>;
type Test_XOR3_010 = Assert<XOR3<0, 1, 0>, 1>;
type Test_XOR3_011 = Assert<XOR3<0, 1, 1>, 0>;
type Test_XOR3_100 = Assert<XOR3<1, 0, 0>, 1>;
type Test_XOR3_101 = Assert<XOR3<1, 0, 1>, 0>;
type Test_XOR3_110 = Assert<XOR3<1, 1, 0>, 0>;
type Test_XOR3_111 = Assert<XOR3<1, 1, 1>, 1>;

type Test_NOT_0 = Assert<NOT<0>, 1>;
type Test_NOT_1 = Assert<NOT<1>, 0>;

type Test_AND_00 = Assert<AND<0, 0>, 0>;
type Test_AND_01 = Assert<AND<0, 1>, 0>;
type Test_AND_10 = Assert<AND<1, 0>, 0>;
type Test_AND_11 = Assert<AND<1, 1>, 1>;

type Test_OR_00 = Assert<OR<0, 0>, 0>;
type Test_OR_01 = Assert<OR<0, 1>, 1>;
type Test_OR_10 = Assert<OR<1, 0>, 1>;
type Test_OR_11 = Assert<OR<1, 1>, 1>;

type Test_XOR_00 = Assert<XOR<0, 0>, 0>;
type Test_XOR_01 = Assert<XOR<0, 1>, 1>;
type Test_XOR_10 = Assert<XOR<1, 0>, 1>;
type Test_XOR_11 = Assert<XOR<1, 1>, 0>;

type Test_NOR_00 = Assert<NOR<0, 0>, 1>;
type Test_NOR_01 = Assert<NOR<0, 1>, 0>;
type Test_NOR_10 = Assert<NOR<1, 0>, 0>;
type Test_NOR_11 = Assert<NOR<1, 1>, 0>;

type Test_NAND_00 = Assert<NAND<0, 0>, 1>;
type Test_NAND_01 = Assert<NAND<0, 1>, 1>;
type Test_NAND_10 = Assert<NAND<1, 0>, 1>;
type Test_NAND_11 = Assert<NAND<1, 1>, 0>;

type Test_XNOR_00 = Assert<XNOR<0, 0>, 1>;
type Test_XNOR_01 = Assert<XNOR<0, 1>, 0>;
type Test_XNOR_10 = Assert<XNOR<1, 0>, 0>;
type Test_XNOR_11 = Assert<XNOR<1, 1>, 1>;

type DecimalToBinaryMap = [
  [0],
  [1],
  [1, 0],
  [1, 1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
  [1, 1, 1],
  [1, 0, 0, 0],
  [1, 0, 0, 1],
];

type Subtract<A extends number, B extends number> = SizedTuple<A> extends [
  ...SizedTuple<B>,
  ...infer N extends number[],
]
  ? N['length']
  : 0;

type Test_Subtract_5_1 = Assert<Subtract<5, 1>, 4>;
type Test_Subtract_5_5 = Assert<Subtract<5, 5>, 0>;

type LT<A extends number, B extends number> = A extends B
  ? false
  : A extends 0
    ? true
    : B extends 0
      ? false
      : LT<Subtract<A, 1>, Subtract<B, 1>>;

type Test_LT_5_5 = Assert<LT<5, 5>, false>;
type Test_LT_5_6 = Assert<LT<5, 6>, true>;
type Test_LT_6_5 = Assert<LT<6, 5>, false>;

type LTE<A extends number, B extends number> = A extends B
  ? true
  : A extends 0
    ? true
    : B extends 0
      ? false
      : LTE<Subtract<A, 1>, Subtract<B, 1>>;

type Test_LTE_5_5 = Assert<LTE<5, 5>, true>;
type Test_LTE_5_6 = Assert<LTE<5, 6>, true>;
type Test_LTE_6_5 = Assert<LTE<6, 5>, false>;

type Divide<A extends number, B extends number, S extends number = 0> = LT<
  A,
  B
> extends true
  ? S
  : Divide<Subtract<A, B>, B, Add<S, 1>>;

type Test_Divide_20_5 = Assert<Divide<20, 5>, 4>;
type Test_Divide_30_6 = Assert<Divide<30, 6>, 5>;

type Mod<A extends number, B extends number> = LT<A, B> extends true
  ? A
  : Mod<Subtract<A, B>, B>;

type Test_Mod_1_2 = Assert<Mod<1, 2>, 1>;
type Test_Mod_5_3 = Assert<Mod<5, 3>, 2>;

type ToBase<
  N extends number,
  Alphabet extends unknown[],
  R extends Alphabet[number][] = [],
> = N extends 0
  ? R
  : ToBase<
      Divide<N, Alphabet['length']>,
      Alphabet,
      [Alphabet[Mod<N, Alphabet['length']>], ...R]
    >;

type JoinTuple<
  T extends (string | number | bigint)[],
  Prefix extends string = '',
> = T extends [
  infer Head extends string | number | bigint,
  ...infer Tail extends (string | number | bigint)[],
]
  ? `${Prefix}${Head}${JoinTuple<Tail>}`
  : '';

type f = JoinTuple<[0, 'A']>;

type ToHex<N extends number> = ToBase<
  N,
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
>;
type Test_ToHex_123 = Assert<JoinTuple<ToHex<123>, '0x'>, '0x7B'>;

type ToBinary<N extends number, R extends number[] = []> = N extends 0
  ? R
  : ToBinary<Divide<N, 2>, [Mod<N, 2>, ...R]>;

type Test_ToBinary_12 = Assert<ToBinary<12>, [1, 1, 0, 0]>;
type Test_ToBinary_137 = Assert<ToBinary<137>, [1, 0, 0, 0, 1, 0, 0, 1]>;

type Chars<S extends string> = S extends `${infer Head}${infer Tail}`
  ? [Head, ...Chars<Tail>]
  : [];

type ASCIITable = {
  '0': 48;
  '1': 49;
  '2': 50;
  '3': 51;
  '4': 52;
  '5': 53;
  '6': 54;
  '7': 55;
  '8': 56;
  '9': 57;
  '\u0000': 0;
  '\u0001': 1;
  '\u0002': 2;
  '\u0003': 3;
  '\u0004': 4;
  '\u0005': 5;
  '\u0006': 6;
  '\u0007': 7;
  '\b': 8;
  '\t': 9;
  '\n': 10;
  '\u000b': 11;
  '\f': 12;
  '\r': 13;
  '\u000e': 14;
  '\u000f': 15;
  '\u0010': 16;
  '\u0011': 17;
  '\u0012': 18;
  '\u0013': 19;
  '\u0014': 20;
  '\u0015': 21;
  '\u0016': 22;
  '\u0017': 23;
  '\u0018': 24;
  '\u0019': 25;
  '\u001a': 26;
  '\u001b': 27;
  '\u001c': 28;
  '\u001d': 29;
  '\u001e': 30;
  '\u001f': 31;
  ' ': 32;
  '!': 33;
  '"': 34;
  '#': 35;
  $: 36;
  '%': 37;
  '&': 38;
  "'": 39;
  '(': 40;
  ')': 41;
  '*': 42;
  '+': 43;
  ',': 44;
  '-': 45;
  '.': 46;
  '/': 47;
  ':': 58;
  ';': 59;
  '<': 60;
  '=': 61;
  '>': 62;
  '?': 63;
  '@': 64;
  A: 65;
  B: 66;
  C: 67;
  D: 68;
  E: 69;
  F: 70;
  G: 71;
  H: 72;
  I: 73;
  J: 74;
  K: 75;
  L: 76;
  M: 77;
  N: 78;
  O: 79;
  P: 80;
  Q: 81;
  R: 82;
  S: 83;
  T: 84;
  U: 85;
  V: 86;
  W: 87;
  X: 88;
  Y: 89;
  Z: 90;
  '[': 91;
  '\\\\': 92;
  ']': 93;
  '^': 94;
  _: 95;
  '`': 96;
  a: 97;
  b: 98;
  c: 99;
  d: 100;
  e: 101;
  f: 102;
  g: 103;
  h: 104;
  i: 105;
  j: 106;
  k: 107;
  l: 108;
  m: 109;
  n: 110;
  o: 111;
  p: 112;
  q: 113;
  r: 114;
  s: 115;
  t: 116;
  u: 117;
  v: 118;
  w: 119;
  x: 120;
  y: 121;
  z: 122;
  '{': 123;
  '|': 124;
  '}': 125;
  '~': 126;
  '\x7F': 127;
  '\x80': 128;
  '\x81': 129;
  '\x82': 130;
  '\x83': 131;
  '\x84': 132;
  '\x85': 133;
  '\x86': 134;
  '\x87': 135;
  '\x88': 136;
  '\x89': 137;
  '\x8A': 138;
  '\x8B': 139;
  '\x8C': 140;
  '\x8D': 141;
  '\x8E': 142;
  '\x8F': 143;
  '\x90': 144;
  '\x91': 145;
  '\x92': 146;
  '\x93': 147;
  '\x94': 148;
  '\x95': 149;
  '\x96': 150;
  '\x97': 151;
  '\x98': 152;
  '\x99': 153;
  '\x9A': 154;
  '\x9B': 155;
  '\x9C': 156;
  '\x9D': 157;
  '\x9E': 158;
  '\x9F': 159;
  ' ': 160;
  '¡': 161;
  '¢': 162;
  '£': 163;
  '¤': 164;
  '¥': 165;
  '¦': 166;
  '§': 167;
  '¨': 168;
  '©': 169;
  ª: 170;
  '«': 171;
  '¬': 172;
  '': 173;
  '®': 174;
  '¯': 175;
  '°': 176;
  '±': 177;
  '²': 178;
  '³': 179;
  '´': 180;
  µ: 181;
  '¶': 182;
  '·': 183;
  '¸': 184;
  '¹': 185;
  º: 186;
  '»': 187;
  '¼': 188;
  '½': 189;
  '¾': 190;
  '¿': 191;
  À: 192;
  Á: 193;
  Â: 194;
  Ã: 195;
  Ä: 196;
  Å: 197;
  Æ: 198;
  Ç: 199;
  È: 200;
  É: 201;
  Ê: 202;
  Ë: 203;
  Ì: 204;
  Í: 205;
  Î: 206;
  Ï: 207;
  Ð: 208;
  Ñ: 209;
  Ò: 210;
  Ó: 211;
  Ô: 212;
  Õ: 213;
  Ö: 214;
  '×': 215;
  Ø: 216;
  Ù: 217;
  Ú: 218;
  Û: 219;
  Ü: 220;
  Ý: 221;
  Þ: 222;
  ß: 223;
  à: 224;
  á: 225;
  â: 226;
  ã: 227;
  ä: 228;
  å: 229;
  æ: 230;
  ç: 231;
  è: 232;
  é: 233;
  ê: 234;
  ë: 235;
  ì: 236;
  í: 237;
  î: 238;
  ï: 239;
  ð: 240;
  ñ: 241;
  ò: 242;
  ó: 243;
  ô: 244;
  õ: 245;
  ö: 246;
  '÷': 247;
  ø: 248;
  ù: 249;
  ú: 250;
  û: 251;
  ü: 252;
  ý: 253;
  þ: 254;
  ÿ: 255;
};
type InvASCIITable = {[key in keyof ASCIITable as `${ASCIITable[key]}`]: key};

type Base64Table = {
  0: 'A';
  1: 'B';
  2: 'C';
  3: 'D';
  4: 'E';
  5: 'F';
  6: 'G';
  7: 'H';
  8: 'I';
  9: 'J';
  10: 'K';
  11: 'L';
  12: 'M';
  13: 'N';
  14: 'O';
  15: 'P';
  16: 'Q';
  17: 'R';
  18: 'S';
  19: 'T';
  20: 'U';
  21: 'V';
  22: 'W';
  23: 'X';
  24: 'Y';
  25: 'Z';
  26: 'a';
  27: 'b';
  28: 'c';
  29: 'd';
  30: 'e';
  31: 'f';
  32: 'g';
  33: 'h';
  34: 'i';
  35: 'j';
  36: 'k';
  37: 'l';
  38: 'm';
  39: 'n';
  40: 'o';
  41: 'p';
  42: 'q';
  43: 'r';
  44: 's';
  45: 't';
  46: 'u';
  47: 'v';
  48: 'w';
  49: 'x';
  50: 'y';
  51: 'z';
  52: '0';
  53: '1';
  54: '2';
  55: '3';
  56: '4';
  57: '5';
  58: '6';
  59: '7';
  60: '8';
  61: '9';
  62: '+';
  63: '/';
};

type InvBase64Table = {
  [key in keyof Base64Table as `${Base64Table[key]}`]: key;
};

type TakeEnd<
  N extends number,
  T extends unknown[],
  S extends unknown[] = [],
> = S['length'] extends N
  ? [S, T]
  : T extends [...infer Head, infer Tail]
    ? TakeEnd<N, Head, [Tail, ...S]>
    : [S, T];

type ToASCIIBinary<
  I extends (keyof ASCIITable)[],
  S extends unknown[] = [],
> = I extends []
  ? S
  : I extends [
        infer Head extends keyof ASCIITable,
        ...infer Tail extends (keyof ASCIITable)[],
      ]
    ? ToASCIIBinary<
        Tail,
        [...S, ...FillTupleFront<8, ToBinary<ASCIITable[Head]>>]
      >
    : [];

type Take<
  N extends number,
  T extends unknown[],
  S extends unknown[] = [],
> = S['length'] extends N
  ? [S, T]
  : T extends [infer Head, ...infer Tail]
    ? Take<N, Tail, [...S, Head]>
    : [S, T];

type ToSextetOctets<T extends number[], S extends number[] = []> = Take<
  6,
  T
> extends [infer Head extends number[], infer Rest extends number[]]
  ? Head extends []
    ? S
    : ToSextetOctets<
        Rest,
        [...S, ToDecimal<Cast<FillTupleBack<6, Head>, Bit[]>>]
      >
  : [];

type MapToBase64Table<
  N extends (keyof Base64Table)[],
  S extends string[] = [],
> = N extends [
  infer Head extends keyof Base64Table,
  ...infer Tail extends (keyof Base64Table)[],
]
  ? MapToBase64Table<Tail, [...S, Base64Table[Head]]>
  : S;

type AddBase64Padding<E extends string> = `${E}${JoinTuple<
  Take<Mod<Chars<E>['length'], 4>, ['=', '=']>[0]
>}`;

// FIXME: why does this hit a recursion limit?
// @ts-expect-error recursion limit
type Base64Encode<S extends string> = AddBase64Padding<
  JoinTuple<MapToBase64Table<ToSextetOctets<ToASCIIBinary<Chars<S>>>>>
>;

type Test_Base64 = Assert<
  Base64Encode<'base64 encode this!'>,
  'YmFzZTY0IGVuY29kZSB0aGlzIQ=='
>;
// ^?

type Test_Base64_ABC = Assert<Base64Encode<'ABC'>, 'QUJD'>;
// ^?

type Unprefix00<S extends string> = S extends `00${infer U extends string}`
  ? U
  : never;

type Test_Unprefix00 = Assert<Unprefix00<'00010000'>, '010000'>;

type ToString<T extends string | number> = `${T}`;

type MapToInvBase64Table<
  N extends (keyof InvBase64Table)[],
  S extends number[] = [],
> = N extends [
  infer Head extends keyof InvBase64Table,
  ...infer Tail extends (keyof InvBase64Table)[],
]
  ? MapToInvBase64Table<Tail, [...S, InvBase64Table[Head]]>
  : S;

type MapToBinary<N extends number[], S extends string[] = []> = N extends [
  infer Head extends number,
  ...infer Tail extends number[],
]
  ? MapToBinary<Tail, [...S, JoinTuple<FillTupleFront<6, ToBinary<Head>>>]>
  : S;

type MapToBits<N extends string[], S extends Bit[] = []> = N extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? MapToBits<Tail, [...S, Head extends '0' ? 0 : Head extends '1' ? 1 : never]>
  : S;

type MapToDecimal<N extends string[], S extends number[] = []> = N extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? MapToDecimal<Tail, [...S, ToDecimal<MapToBits<Chars<Head>>>]>
  : S;

type TakeOctets<T extends string[], S extends string[] = []> = Take<
  8,
  T
> extends [infer Head extends string[], infer Tail extends string[]]
  ? Head extends []
    ? S
    : //: TakeOctets<Tail, Head extends FillTupleFront<8> ? [...S, JoinTuple<Head>] : S>
      TakeOctets<Tail, Head['length'] extends 8 ? [...S, JoinTuple<Head>] : S>
  : [];

type MapToString<N extends number[], S extends string[] = []> = N extends [
  infer Head extends number,
  ...infer Tail extends number[],
]
  ? MapToString<Tail, [...S, ToString<Head>]>
  : S;

type MapToInvASCII<
  N extends (keyof InvASCIITable)[],
  S extends InvASCIITable[keyof InvASCIITable][] = [],
> = N extends [
  infer Head extends keyof InvASCIITable,
  ...infer Tail extends (keyof InvASCIITable)[],
]
  ? MapToInvASCII<Tail, [...S, InvASCIITable[Head]]>
  : S;

type Test_Take = Take<2, Chars<'g'>>;
//^?

type Test_Take8 = TakeOctets<Chars<'0101010100001111'>>;
//^?

type Test_MapToDecimal = MapToDecimal<['011', '1']>;
//^?

type Test_MapToAscii = MapToInvASCII<MapToString<[111, 119, 111]>>;
//^?

// type Test_Base64 = Assert<Base64Encode<'base64 encode this!'>, 'YmFzZTY0IGVuY29kZSB0aGlzIQ=='>;
// ^?

//type Base64Decode<S extends string> = JoinTuple<MapToInvASCII<MapToString<MapToDecimal<TakeOctets<Chars<JoinTuple<MapToBinary<MapToInvBase64Table<Chars<S>>>>>>>>>>
type Base64Decode<S extends string> = JoinTuple<
  MapToInvASCII<
    MapToString<
      MapToDecimal<
        TakeOctets<Chars<JoinTuple<MapToBinary<MapToInvBase64Table<Chars<S>>>>>>
      >
    >
  >
>;

// type H<S extends string> =
//       MapToString<
//         MapToDecimal<
//           TakeOctets<
//             Chars<
//               JoinTuple<
//                 MapToBinary<
//                   MapToInvBase64Table<
//                     Chars<S>
//                   >
//                 >
//               >
//             >
//           >
//         >
//       >
//
// type Base64Decode_Inner<S extends string> =
//   Chars<
//     JoinTuple<
//       MapToBinary<
//         MapToInvBase64Table<
//           Chars<S>
//         >
//       >
//     >
//   >
//
// type Base64Decode_Outer<S extends string[]> =
//   JoinTuple<
//     MapToInvASCII<
//       MapToString<
//         MapToDecimal<
//           TakeOctets<
//             S
//           >
//         >
//       >
//     >
//   >

// type Base64Decode<S extends string> = Base64Decode_Outer<Base64Decode_Inner<S>>;
//
// // type Test_H = H<'YWJjZGVm'>
//   // ^?
//
// type Test_Base64DecodeInnerOuter = Base64Decode_Outer<Base64Decode_Inner<'YWJjZGVm'>>
//   // ^?
//
// type Test_Base64Decode = Base64Decode<'YWJjZGVm'>
//   // ^?
//
// type m = JoinTuple<MapToInvASCII<['97', '98', '99', '100', '101', '102']>>
//   // ^?
