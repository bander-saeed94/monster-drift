# Monster Drift Command Protocol

The monster drift car remote uses [On-Off
Keying](https://en.wikipedia.org/wiki/On-off_keying) (OOK) modulation to
transmit commands to the car.

The protocol is described below.

## Data Symbol

|            |            |
| ---------- | ---------- |
| **Rate**   | 2.15632kHz |
| **Period** | 463.753µs  |

## Preamble

```
1110 1110
1110 1110
```

## Forward

Preamble + 10 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10
```

## Forward+Right

Preamble + 28 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Forward+Left

Preamble + 34 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Backward

Preamble + 40 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Backward+Left

Preamble + 46 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Backward+Right

Preamble + 52 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Wheels Right

Preamble + 58 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Wheels Left

Preamble + 64 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```