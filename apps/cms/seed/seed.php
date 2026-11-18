<?php
// Sample content for the fictional maison, in English and Simplified Chinese.
// Runs on every container start (entrypoint.sh) and only writes what is missing.
// Dates are relative to the first run, so release windows and salons always look current.
use Drupal\Core\File\FileExists;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

$photos = __DIR__ . '/photos';
$alts = array_column(json_decode(file_get_contents("$photos/ledger.json"), TRUE)['items'], 'alt', 'name');

// Drush runs this file inside a function, so helpers that need these values are closures.
$image = function (string $name) use ($photos, $alts): array {
  $uri = "public://seed/$name.jpg";
  $file = current(\Drupal::entityTypeManager()->getStorage('file')->loadByProperties(['uri' => $uri]));
  if (!$file) {
    $fs = \Drupal::service('file_system');
    $dir = 'public://seed';
    $fs->prepareDirectory($dir, FileSystemInterface::CREATE_DIRECTORY);
    $fs->copy("$photos/$name.jpg", $uri, FileExists::Replace);
    $file = File::create(['uri' => $uri, 'status' => 1]);
    $file->save();
  }
  return ['target_id' => $file->id(), 'alt' => $alts[$name] ?? $name];
};

function term(string $vid, array $en, array $zh): Term {
  $found = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => $vid, 'name' => $en['name']]);
  if ($found) {
    return current($found);
  }
  $t = Term::create(['vid' => $vid, 'langcode' => 'en'] + $en);
  $t->save();
  $t->addTranslation('zh-hans', $zh)->save();
  return $t;
}

function node(string $type, array $en, array $zh): Node {
  $n = Node::create(['type' => $type, 'langcode' => 'en', 'status' => 1, 'uid' => 1] + $en);
  $n->save();
  $n->addTranslation('zh-hans', $zh)->save();
  return $n;
}

$day = 86400;
// Times are given in boutique time (Shanghai, UTC+8) and stored in UTC, as Drupal expects.
$at = fn(int $offsetDays, string $time = '10:00') => gmdate('Y-m-d\\TH:i:s', strtotime(gmdate('Y-m-d', time() + $offsetDays * $day) . " $time:00 +08:00"));

// Tiers: the client's card. Rank decides the order of limited-release windows.
$tiers = [];
foreach ([
  [1, 'Thread', '丝', 0, FALSE, 'A single silk thread, where every story begins. Welcome to the maison.', '一根丝线，故事由此开始。欢迎来到本坊。'],
  [2, 'Satin', '缎', 30000, FALSE, 'Woven and lustrous. Early access to new collections and private salons.', '织就的光泽。优先鉴赏新系列，受邀参加私享沙龙。'],
  [3, 'Brocade', '锦', 120000, FALSE, 'The richest silk, patterns woven in. A dedicated advisor and first windows on limited pieces.', '最华美的丝织，纹样织入其中。专属顾问，限量作品优先预留。'],
  [4, 'Kesi', '缂丝', 0, TRUE, 'Carved silk, once reserved for the court: an inch of kesi is worth an inch of gold. By invitation only.', '缂丝，昔为宫廷御用，一寸缂丝一寸金。仅限受邀。'],
] as [$rank, $name, $hanzi, $threshold, $invite, $en, $zh]) {
  $tiers[$name] = term('tier',
    ['name' => $name, 'description' => $en, 'field_rank' => $rank, 'field_hanzi' => $hanzi, 'field_threshold' => $threshold, 'field_invitation' => $invite],
    ['name' => $hanzi, 'description' => $zh]);
}

$cat = [];
foreach ([['Scarves', '丝巾'], ['Ties', '领带'], ['Tea', '茶']] as [$en, $zh]) {
  $cat[$en] = term('category', ['name' => $en], ['name' => $zh]);
}

if (\Drupal::entityQuery('node')->accessCheck(FALSE)->count()->execute() > 0) {
  echo "seed: content already present\n";
  return;
}

$b = [];
foreach ([
  ['QD01', 'Qingdao Flagship', '青岛旗舰店', 'Qingdao', '青岛', '12 Zhanshan Road, Shinan District, Qingdao', '青岛市市南区湛山路12号', 'lattice-garden',
    'The maison\'s first house, a short walk from the sea, with a tea room overlooking the garden.', '本坊第一家旗舰店，距海边仅数步之遥，茶室临园而设。'],
  ['SH01', 'Shanghai', '上海店', 'Shanghai', '上海', '88 Fumin Road, Jing\'an District, Shanghai', '上海市静安区富民路88号', 'teahouse-lattice',
    'A lane house in Jing\'an, with a private salon on the first floor.', '静安区的一栋老洋房，二楼设有私享沙龙。'],
  ['BJ01', 'Beijing', '北京店', 'Beijing', '北京', '9 Wudaoying Hutong, Dongcheng District, Beijing', '北京市东城区五道营胡同9号', 'garden-wall',
    'A courtyard house in the hutongs, where the kesi collection is shown by appointment.', '胡同里的一座四合院，缂丝系列需预约鉴赏。'],
] as [$code, $en, $zh, $cityEn, $cityZh, $addrEn, $addrZh, $img, $txtEn, $txtZh]) {
  $b[$code] = node('boutique',
    ['title' => $en, 'field_code' => $code, 'field_city' => $cityEn, 'field_address' => $addrEn, 'field_hours' => 'Daily, 10:00–20:00',
      'field_subtitle' => $cityEn, 'field_text' => $txtEn, 'field_image' => $image($img)],
    ['title' => $zh, 'field_city' => $cityZh, 'field_address' => $addrZh, 'field_hours' => '每日 10:00–20:00', 'field_subtitle' => $cityZh, 'field_text' => $txtZh]);
}

foreach ([
  ['SC-PEN-90', 'Scarves', 4800, 'Penglai Mist', '蓬莱云雾', 'Silk twill, 90 × 90 cm', '真丝斜纹，90 × 90 厘米', ['silk-floral'],
    "Peonies drift across a sea-green ground, the colour of the morning haze over Penglai.\n\nHand-rolled edges, printed in Shandong.", "牡丹浮于海青色底上，宛如蓬莱清晨的薄雾。\n\n手工卷边，山东印制。", FALSE, NULL, NULL],
  ['SC-IMP-90', 'Scarves', 5600, 'Imperial Thread', '御线', 'Silk twill, 90 × 90 cm', '真丝斜纹，90 × 90 厘米', ['silk-scarf-design'],
    "Lilac clouds on a field of gold, drawn from an archive design for a court scarf.\n\nHand-rolled edges.", "金色底上的丁香色云纹，取自宫廷丝巾的档案图稿。\n\n手工卷边。", FALSE, NULL, NULL],
  ['SC-KES-140', 'Scarves', 12800, 'Cloud Gate, Kesi Edition', '云门 · 缂丝特别版', 'Kesi-woven silk, 140 × 140 cm, 12 pieces', '缂丝织造，140 × 140 厘米，限量12件', ['brocade-robe', 'dupioni-silk'],
    "Dragons and waves woven thread by thread on a hand loom, in the kesi technique once reserved for the court.\n\nTwelve pieces, each numbered. Kesi members are invited first, then each tier one day later.", "龙纹与海水由织工在手工织机上逐线缂织，此技法昔为宫廷御用。\n\n限量十二件，逐一编号。缂丝会员优先受邀，其后每一级会员晚一日开放。", TRUE, 12, -1],
  ['TI-LAT-08', 'Ties', 2200, 'Lattice', '花窗', 'Woven silk, 8 cm', '真丝提花，8 厘米', ['printed-ties'],
    "A basket weave in red and gold, taken from the lattice windows of Qufu.", "红金相间的编织纹，取自曲阜的花窗。", FALSE, NULL, NULL],
  ['TI-TAI-07', 'Ties', 1900, 'Taishan Stripe', '泰山条纹', 'Silk repp, 7 cm', '真丝罗缎，7 厘米', ['striped-tie'],
    "Ink and stone stripes, cut on the bias. The tie for the first meeting.", "墨色与石色相间的斜裁条纹。初次会面的领带。", FALSE, NULL, NULL],
  ['TI-RAW-08', 'Ties', 2400, 'Golden Thread', '金线', 'Raw Shantung silk, 8 cm, 20 pieces', '山东柞蚕丝，8 厘米，限量20件', ['shantung-sleeve', 'dupioni-silk'],
    "Raw Shantung silk with its natural slubs, embroidered by hand with a single golden flower.\n\nTwenty pieces. The windows open in two days, Kesi members first.", "保留天然竹节纹理的山东柞蚕丝，手工绣上一朵金色花。\n\n限量二十件，两日后开放，缂丝会员优先。", TRUE, 20, 2],
  ['TE-LSG-100', 'Tea', 880, 'Laoshan Spring Green', '崂山春绿', 'Green tea, 100 g tin', '绿茶，100 克罐装', ['tea-leaves-dry'],
    "Picked in April on the slopes of Mount Lao, where sea fog keeps the leaves slow and sweet.\n\nA bean-like sweetness and a long, clean finish.", "四月采于崂山山坡，海雾让茶叶生长缓慢、滋味清甜。\n\n豆香甘甜，回味悠长干净。", FALSE, NULL, NULL],
  ['TE-LSM-100', 'Tea', 1280, 'Laoshan Sea Mist', '崂山海雾', 'First-flush green tea, 100 g tin', '头采绿茶，100 克罐装', ['tea-gaiwan'],
    "The first buds of the year, from terraces that look over the Yellow Sea.\n\nBest in a white gaiwan at 80 °C.", "一年中最早的嫩芽，采自面朝黄海的茶园。\n\n宜用白瓷盖碗，80 °C 冲泡。", FALSE, NULL, NULL],
  ['TE-TQR-50', 'Tea', 1880, 'Taiqing Reserve', '太清珍藏', 'Hand-rolled green tea, 50 g', '手工揉捻绿茶，50 克', ['tea-scoop'],
    "A small lot rolled by hand near the Taiqing Palace. Served at our tea salons.", "太清宫附近手工揉捻的小批量茶。于本坊茶会中奉上。", FALSE, NULL, NULL],
] as [$sku, $c, $price, $en, $zh, $subEn, $subZh, $imgs, $txtEn, $txtZh, $limited, $stock, $release]) {
  node('product',
    ['title' => $en, 'field_sku' => $sku, 'field_price' => $price, 'field_category' => $cat[$c]->id(), 'field_subtitle' => $subEn,
      'field_text' => $txtEn, 'field_images' => array_map($image, $imgs), 'field_limited' => $limited,
      'field_stock' => $stock, 'field_release' => $release === NULL ? NULL : $at($release)],
    ['title' => $zh, 'field_subtitle' => $subZh, 'field_text' => $txtZh]);
}

foreach ([
  ['The Art of the Knot', '结之艺', 'Scarf styling with the atelier', '与工坊一同探索丝巾系法', 'QD01', 7, '15:00', 12, 'Thread', 'teahouse-lamps',
    "An afternoon with the atelier, learning six ways to wear a 90 cm square, followed by tea in the garden room.", "与工坊共度一个下午，学习九十厘米方巾的六种系法，随后于花园茶室品茶。"],
  ['Laoshan Tea Ceremony', '崂山茶会', 'With a tea master from Mount Lao', '与崂山茶艺师相会', 'SH01', 14, '16:00', 8, 'Satin', 'tea-set',
    "Three teas from Mount Lao, brewed and explained by a tea master, in the first-floor salon.", "崂山茶艺师于二楼沙龙冲泡并讲解三款崂山茶。"],
  ['Kesi: an Inch of Gold', '缂丝：一寸缂丝一寸金', 'A private preview of the kesi collection', '缂丝系列私享预览', 'BJ01', 21, '18:30', 10, 'Brocade', 'qufu-brackets',
    "The weavers show how kesi is made, thread by thread, before the new pieces are unveiled.", "织工现场展示缂丝的逐线织造，随后揭幕新作品。"],
] as [$en, $zh, $subEn, $subZh, $code, $days, $time, $seats, $tier, $img, $txtEn, $txtZh]) {
  node('salon',
    ['title' => $en, 'field_subtitle' => $subEn, 'field_text' => $txtEn, 'field_date' => $at($days, $time), 'field_boutique' => $b[$code]->id(),
      'field_seats' => $seats, 'field_tier' => $tiers[$tier]->id(), 'field_image' => $image($img)],
    ['title' => $zh, 'field_subtitle' => $subZh, 'field_text' => $txtZh]);
}

foreach ([
  ['The Silk of Shandong', '山东之丝', 'Where Shantung silk comes from', '山东绸的由来', 'silk-cocoons', ['dupioni-silk', 'shantung-sleeve', 'brocade-robe'],
    "Long before it was a fabric, Shantung was a province. Its weavers spun the silk of wild silkworms fed on oak leaves, and the thread came out uneven, with small slubs that catch the light.\n\nThat irregular texture became the cloth's name around the world. Every Shantung scarf and tie still carries it.",
    "早在成为一种面料之前，“山东”是一个省份。这里的织工以吃柞树叶的野蚕之丝纺线，丝线粗细不匀，带着捕捉光线的竹节。\n\n这种不规则的质感，让“山东绸”之名传遍世界。本坊每一条丝巾与领带都延续着它。"],
  ['Tea from the Mountain by the Sea', '海上名山之茶', 'Laoshan green tea', '崂山绿茶', 'tea-leaves-fresh', ['tea-set', 'tea-gaiwan', 'tea-leaves-dry'],
    "Mount Lao rises straight out of the Yellow Sea. Its tea grows further north than almost any green tea in China, and the cold winters and sea fog make it slow, sweet and full.\n\nWe buy from three families on its eastern slopes.",
    "崂山自黄海之滨拔地而起。这里的茶生长在中国绿茶产区的最北端，寒冷的冬季与海雾让它生长缓慢，滋味甘醇饱满。\n\n本坊的茶来自崂山东麓的三户茶农。"],
  ['Under a Clear Sky', '晴空之下', 'The places that shape the maison', '塑造本坊的地方', 'penglai-pavilion', ['taishan-temple', 'qufu-eaves', 'roof-guardians', 'lattice-window', 'temple-of-heaven', 'marble-terrace', 'imperial-vault', 'penglai-hill', 'garden-wall'],
    "Penglai on its cliff above the sea, the temples of Mount Tai, the eaves of Qufu. Our colours come from Shandong on a clear day: lacquer red, ink black, and the white of a sunlit wall.",
    "海崖上的蓬莱阁，泰山的庙宇，曲阜的飞檐。本坊的色彩来自晴日下的山东：漆红、墨黑，以及阳光下白墙的白。"],
] as [$en, $zh, $subEn, $subZh, $img, $gallery, $txtEn, $txtZh]) {
  node('story',
    ['title' => $en, 'field_subtitle' => $subEn, 'field_text' => $txtEn, 'field_image' => $image($img), 'field_images' => array_map($image, $gallery)],
    ['title' => $zh, 'field_subtitle' => $subZh, 'field_text' => $txtZh]);
}

echo "seed: created boutiques, products, salons and stories\n";
