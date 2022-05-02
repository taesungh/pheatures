export interface RawSymbol {
  [index: string]: string
}

type FeatureValue = '+' | '-';

// A symbol represents one segment and its features
class BaseSymbol {
  unicode: string
  sound: string
  features: {
    syllabic: FeatureValue
    stress: FeatureValue
    long: FeatureValue
    consonantal: FeatureValue
    sonorant: FeatureValue
    continuant: FeatureValue
    delayed_release: FeatureValue
    approximant: FeatureValue
    tap: FeatureValue
    trill: FeatureValue
    nasal: FeatureValue
    voice: FeatureValue
    spread_gl: FeatureValue
    constr_gl: FeatureValue
    labial: FeatureValue
    round: FeatureValue
    labiodental: FeatureValue
    coronal: FeatureValue
    anterior: FeatureValue
    distributed: FeatureValue
    strident: FeatureValue
    lateral: FeatureValue
    dorsal: FeatureValue
    high: FeatureValue
    low: FeatureValue
    front: FeatureValue
    back: FeatureValue
    tense: FeatureValue
  }

  constructor(rawSymbol: RawSymbol) {
    this.unicode = rawSymbol.Unicode;
    this.sound = rawSymbol.Sound;
    this.features = {
      syllabic: rawSymbol.syllabic as FeatureValue,
      stress: rawSymbol.stress as FeatureValue,
      long: rawSymbol.long as FeatureValue,
      consonantal: rawSymbol.consonantal as FeatureValue,
      sonorant: rawSymbol.sonorant as FeatureValue,
      continuant: rawSymbol.continuant as FeatureValue,
      delayed_release: rawSymbol.delayed_release as FeatureValue,
      approximant: rawSymbol.approximant as FeatureValue,
      tap: rawSymbol.tap as FeatureValue,
      trill: rawSymbol.trill as FeatureValue,
      nasal: rawSymbol.nasal as FeatureValue,
      voice: rawSymbol.voice as FeatureValue,
      spread_gl: rawSymbol.spread_gl as FeatureValue,
      constr_gl: rawSymbol.constr_gl as FeatureValue,
      labial: rawSymbol.labial as FeatureValue,
      round: rawSymbol.round as FeatureValue,
      labiodental: rawSymbol.labiodental as FeatureValue,
      coronal: rawSymbol.coronal as FeatureValue,
      anterior: rawSymbol.anterior as FeatureValue,
      distributed: rawSymbol.distributed as FeatureValue,
      strident: rawSymbol.strident as FeatureValue,
      lateral: rawSymbol.lateral as FeatureValue,
      dorsal: rawSymbol.dorsal as FeatureValue,
      high: rawSymbol.high as FeatureValue,
      low: rawSymbol.low as FeatureValue,
      front: rawSymbol.front as FeatureValue,
      back: rawSymbol.back as FeatureValue,
      tense: rawSymbol.tense as FeatureValue,
    }
  }
}

export default BaseSymbol;
