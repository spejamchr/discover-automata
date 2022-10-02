import { Translations } from '../Types';

// prettier-ignore
//
// Formatting:
// - Each key/value entry should be on the same line
// - Use "double quotes" around keys & values
// - Sort entries alphabetically
// - Use a comma on the last line
export const ja: Translations = {
  "(Clicking the rule changes the resulting state.)": "（ルールをクリックすると、結果の状態が変わります。）",
  "(First generation)": "（初代）",
  "(Next generation)": "（次の世代）",
  "A simple example of a neighborhood is the current cell and [...]": "近傍の簡単な例は、次のような現在のセルとその 2 つの隣接セルです。",
  "A weather simulation can be used for predictions, but [...]": "気象シミュレーションは予測に使用できますが、現実と完全に一致するわけではありません。",
  "Automaton": "オートマトン",
  "Cellular automata are a kind of zero-player game [...]": "セル オートマトンは、タイル状の「セル」の「宇宙」でプレイされる一種のゼロプレイヤー ゲームです。各オートマトンには独自の構成があり、何世代にもわたって宇宙を進化させることができます。 最もよく知られているセル オートマトンは、おそらく <link>コンウェイのライフ ゲーム</link>でしょう。",
  "Configuration": "構成",
  "Description of the automaton...": "オートマトンの説明...",
  "Discover Automata": "オートマトンを発見",
  "Displaying in color": "カラーで表示",
  "Displaying in grayscale": "グレースケールで表示",
  "Each cell in a cellular automata can be in one of several [...]": "セルオートマトンの各セルは、いくつかの状態のいずれかになり、ほとんどの場合、数値（0 や 1 など）または色（黒や白など）で表されます。",
  "Emulate 1D cellular automata in the browser": "ブラウザーで 1D セル オートマトンをエミュレートする",
  "Emulator": "エミュレータ",
  "Favorites": "お気に入り",
  "Go here to use the emulator.": "エミュレータを使用するには、ここにアクセスしてください。",
  "Hiding state labels": "状態ラベルを非表示",
  "I called this an \"emulator\" instead of a \"simulator,\" [...]": "これを「シミュレーター」ではなく「エミュレーター」と呼んだのは、シミュレーターはシミュレートするものに近づける傾向があるためです。一方、エミュレーターの目標は、エミュレートするものの動作を正確に再現することです。",
  "I wanted to make some fun designs, and had just read about [...]": "楽しいデザインを作りたくて、一次元セルオートマトンについて読んだばかりだったので、このサイトが生まれました。",
  "In general, there are <link>many, many types of [...]": "一般に、セル オートマトンの作成に使用できる <link>非常に多くのタイプの近傍</link> があります（時間とともに変化する近傍を含みます）。 ただし、このサイトで使用される近傍は、現在のセルとその両側の最も近いいくつかのセルの選択に制限されています。",
  "In this simulation, you can set the number of states the [...]": "このシミュレーションでは、セル オートマトンの状態数を設定できます。 また、シミュレーションで状態をグレースケールまたは色を使用して描画するかどうか、および数値ラベルを表示するか非表示にするかを選択することもできます。",
  "Neighbors": "近傍",
  "Once the automaton is configured, this site emulates it by [...]": "オートマトンが設定されると、このサイトは、ランダムな初期世代を生成し、次に多くの子世代を描画することによってそれをエミュレートします。",
  "Once the number of states and the neighborhood [...]": "状態の数と近隣を選択したら、遷移規則を決定する必要があります。 与えられた近隣の状態の可能な組み合わせごとに、結果の状態を選択する必要があります。 例として、セルの隣接セルがすべて <tag>0</tag> の場合、セルは {{nextState}} になるという遷移ルールを次に示します。",
  "One-dimensional Cellular Automata": "一次元セルオートマトン",
  "One-dimensional cellular automata (1DCA) are a kind of [...]": "1 次元セル オートマトン（1DCA）は、タイリングが 1D であるセル オートマトンの一種です。 正方形の線と考えることができます。 これにより、1DCA の多くの世代を簡単に描画できます。すべての生成線を次々に描画して、長方形を形成できます。",
  "Overflow Error: please use smaller numbers": "[TODO] Overflow Error: please use smaller numbers",
  "Randomize": "ランダム化",
  "Recreate Default Favorites": "デフォルトのお気に入りを再作成する",
  "Read on, or skip straight to <link>the emulator</link>.": "読み進めるか、スキップして<link>エミュレータ</link>に進んでください。",
  "Rule 110: Turing-complete!": "ルール110: チューリング完全!",
  "Rule 184: The \"traffic rule\"": "ルール184: 「交通ルール」",
  "Rule 30: Mathematica used this as an RNG": "ルール30: MathematicaはこれをRNGとして使用した",
  "Rule 90: The exclusive-or function": "ルール90: 排他的論理和関数",
  "Rule Number": "ルール番号",
  "Settings": "設定",
  "Showing state labels": "状態ラベルの表示",
  "Something went wrong... Refresh to try again.": "エラーが発生しました...ブラウザを更新してもう一度お試しください。",
  "States": "状態",
  "These transition rules can be encoded as a single number, [...]": "これらの遷移ルールは、遷移ルールを変更するためにも使用できる単一の番号「ルール番号」としてエンコードできます。",
  "This representation of the transition rules as a [...]": "この\"規則番号\"としての遷移規則の表現は<link>Wolframコード</link>を使用しています。",
  "To define a 1DCA we need to know three things: the number [...]": "1DCA を定義するには、次の 3 つのことを知る必要があります。使用する状態の数、次の世代を計算するときに考慮すべき隣接セル、セルがどの状態に進化するかを決定するための遷移規則（隣接セルの状態に基づく）。",
  "Transition Rules": "遷移規則",
  "What's this all about?": "これは何ですか？",
  "When using a (good) video game emulator, the video game [...]": "（良い）ビデオ ゲーム エミュレーターを使用する場合、エミュレーターはエミュレートしているシステムとまったく同じように動作するため、ビデオ ゲームはエミュレーター上で実行されていることを認識できません。",
  "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life": "https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0",
  "maximum digits:": "最大桁数：",
  "native-locale-name": "日本語",
};