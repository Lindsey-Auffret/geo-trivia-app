import React, { useState, useMemo, useCallback } from "react";

// ---------------------------------------------------------------------------
// Question bank — 100 sourced superlative geography facts (country borders,
// top-5 rankings, physical geography, and capitals/cities).
// ---------------------------------------------------------------------------
const BANK = [
  // ---- Only country that... ----
  { prompt: "Which is the only sovereign country with land in all four hemispheres?", options: ["Kiribati", "Indonesia", "Ecuador", "Maldives"], answer: 0, fact: "Kiribati's scattered islands straddle both the Equator and the 180th meridian." },
  { prompt: "Which is the only country whose national flag is not a rectangle or square?", options: ["Nepal", "Bhutan", "Switzerland", "Vatican City"], answer: 0, fact: "Nepal's flag is made of two stacked triangular pennants, unique among national flags." },
  { prompt: "Which is the only independent country lying entirely above 1,000 metres elevation?", options: ["Lesotho", "Bhutan", "Nepal", "Rwanda"], answer: 0, fact: "Even Lesotho's lowest point, where the Orange and Makhaleng rivers meet, sits at about 1,400 m." },
  { prompt: "Which country consists of a narrow river corridor surrounded on three sides by a single neighbor?", options: ["The Gambia", "Lesotho", "Eswatini", "San Marino"], answer: 0, fact: "The Gambia follows the Gambia River inland, nearly enclaved by Senegal except for its Atlantic coast." },
  { prompt: "Which country's only two land neighbors are Russia and China?", options: ["Mongolia", "Kazakhstan", "North Korea", "Belarus"], answer: 0, fact: "Mongolia is landlocked between exactly two countries: Russia to the north and China to the south." },
  { prompt: "Which is the only UN member state entirely enclaved by South Africa?", options: ["Lesotho", "Eswatini", "Botswana", "Namibia"], answer: 0, fact: "Lesotho has no coastline and no other neighbor besides South Africa." },
  { prompt: "Which is the only country (besides Vatican City) entirely surrounded by Italy?", options: ["San Marino", "Vatican City", "Monaco", "Liechtenstein"], answer: 0, fact: "San Marino is a landlocked enclave in north-central Italy, near the Adriatic coast." },
  { prompt: "Which is the only independent state located wholly inside the city of Rome?", options: ["Vatican City", "San Marino", "Monaco", "Andorra"], answer: 0, fact: "Vatican City sits on the west bank of the Tiber, entirely surrounded by Rome." },
  { prompt: "Which UN member state has no official capital city?", options: ["Nauru", "Palau", "Tuvalu", "Kiribati"], answer: 0, fact: "Nauru's government offices are based in Yaren District, but no city is designated the official capital." },
  { prompt: "Which country's national flag is the only one to feature a modern firearm?", options: ["Mozambique", "Angola", "Zimbabwe", "Cuba"], answer: 0, fact: "Mozambique's flag depicts an AK-47 rifle, layered over a hoe and book." },
  { prompt: "Which country's flag is the only one with different emblems on its front and back?", options: ["Paraguay", "Uruguay", "Bolivia", "Ecuador"], answer: 0, fact: "Paraguay's flag bears the national coat of arms on the obverse and the treasury seal on the reverse." },
  { prompt: "Which is the only UN member state with a perfectly square national flag?", options: ["Switzerland", "Vatican City", "Nepal", "San Marino"], answer: 0, fact: "Switzerland's flag is square; Vatican City also uses a square flag but isn't a UN member." },
  { prompt: "Which country is commonly credited with having the most time zones (12), thanks to its overseas territories?", options: ["France", "Russia", "United States", "United Kingdom"], answer: 0, fact: "French Polynesia, French Guiana, and other territories spread France's time zones across the globe." },
  { prompt: "Which country spans 11 official time zones within a single contiguous state?", options: ["Russia", "Canada", "United States", "China"], answer: 0, fact: "Russia's clocks run from UTC+2 in Kaliningrad to UTC+12 in Kamchatka." },
  { prompt: "Which country is the first in the world to greet each new calendar day, running clocks as far ahead as UTC+14?", options: ["Kiribati", "Samoa", "New Zealand", "Tonga"], answer: 0, fact: "Kiribati's Kiritimati (Christmas) Island keeps UTC+14, the earliest civil time on Earth." },
  { prompt: "Which country runs on a single official time zone despite spanning roughly five geographical ones?", options: ["China", "Russia", "United States", "Australia"], answer: 0, fact: "All of China observes China Standard Time (UTC+8), even in the far west where solar time differs by hours." },
  { prompt: "Which is the only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea?", options: ["Colombia", "Venezuela", "Ecuador", "Peru"], answer: 0, fact: "No other South American country touches both the Pacific and the Caribbean." },
  { prompt: "Which is the only country crossed by both the Equator and the Tropic of Capricorn?", options: ["Brazil", "Peru", "Bolivia", "Colombia"], answer: 0, fact: "Brazil stretches from just north of the Equator down past the Tropic of Capricorn in its south." },
  { prompt: "Which country is named directly after the Equator, which crosses it?", options: ["Ecuador", "Kenya", "Gabon", "Indonesia"], answer: 0, fact: "\u201cEcuador\u201d is Spanish for \u201cequator.\u201d" },
  { prompt: "Which is the only sovereign country outside Europe where Dutch is the sole official language?", options: ["Suriname", "Guyana", "Aruba", "Belgium"], answer: 0, fact: "Suriname's Dutch colonial history left it as the only Dutch-official state outside Europe." },
  { prompt: "Which is the only African country with Spanish as an official language?", options: ["Equatorial Guinea", "Morocco", "Angola", "Mozambique"], answer: 0, fact: "Equatorial Guinea lists Spanish, French, and Portuguese as official, but Spanish's national status is unique on the continent." },
  { prompt: "Which is the only country bordering both the Caspian Sea and the Persian Gulf?", options: ["Iran", "Iraq", "Turkey", "Azerbaijan"], answer: 0, fact: "Iran fronts the Persian Gulf and Gulf of Oman in the south and the Caspian in the north." },
  { prompt: "Which country's neighbors range from Norway in the northwest to North Korea in the Far East?", options: ["Russia", "China", "Kazakhstan", "Mongolia"], answer: 0, fact: "Russia's sheer size gives it land borders with both of those far-apart countries." },
  { prompt: "Which country borders Russia and Iran while also fronting the Caspian Sea?", options: ["Azerbaijan", "Georgia", "Armenia", "Turkmenistan"], answer: 0, fact: "Azerbaijan sits at the junction of the South Caucasus and the Caspian coast." },
  { prompt: "Which is the only country bordering China, Russia, and South Korea all at once?", options: ["North Korea", "Mongolia", "Vietnam", "Laos"], answer: 0, fact: "North Korea's short northeastern border touches Russia in addition to its longer China and South Korea borders." },
  { prompt: "Which is the only country bordering both Bulgaria and Iran?", options: ["Turkey", "Georgia", "Iraq", "Syria"], answer: 0, fact: "Turkey's territory spans from the Balkans to the edge of the Iranian plateau." },
  { prompt: "Which is the only country bordering both Kuwait and Turkey?", options: ["Iraq", "Syria", "Jordan", "Saudi Arabia"], answer: 0, fact: "Iraq's six neighbors include Kuwait to the southeast and Turkey to the north." },
  { prompt: "Which is the only country bordering both Qatar and Yemen?", options: ["Saudi Arabia", "United Arab Emirates", "Oman", "Jordan"], answer: 0, fact: "Saudi Arabia's size gives it borders with both smaller Gulf states." },
  { prompt: "Which is the only country bordering both Tanzania and Eswatini?", options: ["Mozambique", "Zimbabwe", "Malawi", "Zambia"], answer: 0, fact: "Mozambique runs along Africa's southeast coast from Tanzania down to Eswatini's doorstep." },
  { prompt: "Which country's only land neighbor is Spain?", options: ["Portugal", "Andorra", "Monaco", "Luxembourg"], answer: 0, fact: "Portugal shares its entire land border with a single country: Spain." },
  { prompt: "Which country's only land neighbor is the United Kingdom?", options: ["Ireland", "Iceland", "Malta", "Cyprus"], answer: 0, fact: "Ireland's sole land border runs through Northern Ireland, part of the UK." },
  { prompt: "Which country's only land neighbor is Haiti?", options: ["Dominican Republic", "Cuba", "Jamaica", "Puerto Rico"], answer: 0, fact: "The Dominican Republic shares the island of Hispaniola with Haiti, and borders no other country." },
  { prompt: "Which country's only land neighbor is the Dominican Republic?", options: ["Haiti", "Cuba", "Jamaica", "Bahamas"], answer: 0, fact: "Haiti and the Dominican Republic are each other's sole land neighbor, sharing the island of Hispaniola." },
  { prompt: "Which country is split into two separate, non-touching pieces by Malaysia on the island of Borneo?", options: ["Brunei", "Malaysia", "Indonesia", "Philippines"], answer: 0, fact: "Brunei's territory forms two enclaves on Borneo's north coast, divided by Malaysian land." },
  { prompt: "Which country runs over 4,000 km along the Pacific while averaging under 200 km wide?", options: ["Chile", "Peru", "Norway", "Vietnam"], answer: 0, fact: "Chile's ribbon-like shape stretches roughly 2,700 miles north-south, averaging only about 110 miles wide." },

  // ---- Top 5 countries by... ----
  { prompt: "Which of these is one of the 5 largest countries in the world by total area?", options: ["Canada", "Australia", "India", "Argentina"], answer: 0, fact: "Top 5 by area: Russia, Canada, the United States, China, and Brazil." },
  { prompt: "Which of these is one of the 5 most populous countries in the world?", options: ["Indonesia", "Nigeria", "Brazil", "Bangladesh"], answer: 0, fact: "Top 5 by population: India, China, the United States, Indonesia, and Pakistan." },
  { prompt: "Which of these is one of the 5 largest economies in the world by nominal GDP?", options: ["Germany", "France", "India", "Italy"], answer: 0, fact: "Top 5 by nominal GDP: United States, China, Germany, Japan, and the United Kingdom." },
  { prompt: "Which of these ranks among the top 5 economies in the world by GDP adjusted for purchasing power (PPP)?", options: ["India", "Germany", "Indonesia", "Brazil"], answer: 0, fact: "By GDP PPP the order shifts: China, United States, India, Russia, and Japan \u2014 India outranks Germany and Japan on this measure." },
  { prompt: "Which of these is one of the top 5 exporters of physical goods (merchandise) in the world?", options: ["Netherlands", "Japan", "France", "South Korea"], answer: 0, fact: "Top 5 merchandise exporters: China, the United States, Germany, the Netherlands, and Hong Kong." },
  { prompt: "Which of these has one of the 5 longest coastlines in the world?", options: ["Philippines", "Australia", "Norway", "Chile"], answer: 0, fact: "Top 5 by coastline length: Canada, Indonesia, Russia, the Philippines, and Japan." },
  { prompt: "Which of these is commonly cited among the 5 countries with the most islands?", options: ["Finland", "Greece", "Philippines", "Croatia"], answer: 0, fact: "National inventories put Sweden, Norway, Finland, Canada, and Indonesia at the top; island counts vary widely by definition." },
  { prompt: "Which of these has one of the 5 highest numbers of land border neighbors?", options: ["Brazil", "India", "Austria", "France"], answer: 0, fact: "Top 5 by land neighbors: China and Russia (14 each), Brazil (10), and the DR Congo and Germany (9 each)." },
  { prompt: "Which of these has one of the 5 highest counts of UNESCO World Heritage Sites?", options: ["Spain", "Greece", "Mexico", "India"], answer: 0, fact: "Top 5: Italy (60), China (59), Germany (54), France (53), and Spain (50)." },
  { prompt: "Which of these has one of the 5 largest total forest areas in the world?", options: ["China", "Indonesia", "DR Congo", "Peru"], answer: 0, fact: "Top 5 by forest area: Russia, Brazil, Canada, the United States, and China." },
  { prompt: "Which of these has one of the 5 highest shares of its land covered by forest?", options: ["Gabon", "Brazil", "Republic of Congo", "Malaysia"], answer: 0, fact: "Top 5 by forest share: Suriname, Micronesia, Gabon, Palau, and the Solomon Islands, all over 90%." },
  { prompt: "Which of these has one of the 5 largest total areas of agricultural land?", options: ["Australia", "India", "Argentina", "Canada"], answer: 0, fact: "Top 5: China, the United States, Australia, Brazil, and Russia." },
  { prompt: "Which of these is one of the 5 largest cereal producers in the world?", options: ["India", "Argentina", "Ukraine", "Indonesia"], answer: 0, fact: "Top 5 cereal producers: China, the United States, India, Brazil, and Russia." },
  { prompt: "Which of these carries one of the 5 highest volumes of air passenger traffic, per airline nationality?", options: ["Ireland", "Germany", "United Kingdom", "United Arab Emirates"], answer: 0, fact: "Top 5: the United States, China, Ireland, India, and T\u00fcrkiye \u2014 Ireland ranks high because of its hub carriers, not its population." },
  { prompt: "Which of these has one of the 5 largest urban populations in the world?", options: ["Brazil", "Nigeria", "Russia", "Japan"], answer: 0, fact: "Top 5 by urban population: China, India, the United States, Brazil, and Indonesia." },
  { prompt: "Which of these has one of the 5 largest rural populations in the world?", options: ["Bangladesh", "Nigeria", "Ethiopia", "Vietnam"], answer: 0, fact: "Top 5 by rural population: India, China, Pakistan, Bangladesh, and Indonesia." },
  { prompt: "Which of these has one of the 5 highest shares of land under environmental protection?", options: ["Bhutan", "Costa Rica", "Namibia", "Kenya"], answer: 0, fact: "Top 5: Seychelles, Venezuela, Bhutan, Liechtenstein, and Bulgaria, all sovereign states." },
  { prompt: "Which of these is one of the 5 largest generators of solar electricity?", options: ["Japan", "Australia", "Spain", "South Korea"], answer: 0, fact: "Top 5 solar generators: China, the United States, India, Japan, and Germany." },
  { prompt: "Which of these is one of the 5 largest exporters of crude petroleum by value?", options: ["Canada", "United Arab Emirates", "Kuwait", "Norway"], answer: 0, fact: "Top 5 crude oil exporters: Saudi Arabia, Russia, Canada, the United States, and Iraq." },
  { prompt: "Which of these is one of the 5 largest rice exporters in the world?", options: ["Pakistan", "Myanmar", "China", "Cambodia"], answer: 0, fact: "Top 5 rice exporters: India, Thailand, Vietnam, Pakistan, and the United States." },
  { prompt: "Which of these is one of the 5 largest cocoa bean exporters in the world?", options: ["Ecuador", "Indonesia", "Brazil", "Peru"], answer: 0, fact: "Top 5: C\u00f4te d'Ivoire, Ecuador, Ghana, Nigeria, and Cameroon." },
  { prompt: "Which of these is one of the 5 largest wheat exporters in the world?", options: ["Australia", "Argentina", "France", "India"], answer: 0, fact: "Top 5 wheat exporters: Russia, Australia, Canada, the United States, and Ukraine." },
  { prompt: "Which of these is one of the 5 largest banana exporters in the world?", options: ["Guatemala", "Honduras", "Brazil", "Mexico"], answer: 0, fact: "Top 5: Ecuador, the Philippines, Guatemala, Costa Rica, and Colombia." },
  { prompt: "Which of these is one of the 5 largest producers of green coffee?", options: ["Indonesia", "Mexico", "Peru", "Honduras"], answer: 0, fact: "Top 5 coffee producers: Brazil, Vietnam, Indonesia, Colombia, and Ethiopia." },
  { prompt: "Which of these is one of the 5 countries with the highest share of population using the internet?", options: ["Denmark", "Norway", "Iceland", "Finland"], answer: 0, fact: "Top 5: Bahrain, Kuwait, Saudi Arabia, and the UAE at 100%, and Denmark at nearly 100%." },
  { prompt: "Which of these ranks among the 5 highest countries by GDP per capita?", options: ["Ireland", "Norway", "Qatar", "Singapore"], answer: 0, fact: "Top 5 by GDP per capita: Monaco, Liechtenstein, Luxembourg, Ireland, and Switzerland." },

  // ---- Only feature (river/lake/sea/mountain/desert/strait) that... ----
  { prompt: "Which is the only sea in the world with no land boundary at all?", options: ["Sargasso Sea", "Caspian Sea", "Coral Sea", "Bering Sea"], answer: 0, fact: "Ocean currents, not coastlines, define the Sargasso Sea's borders in the North Atlantic." },
  { prompt: "Which major river is the only one that crosses the Equator twice?", options: ["Congo River", "Amazon River", "Nile River", "Niger River"], answer: 0, fact: "The Congo's great arc swings north and then south across the Equator." },
  { prompt: "Which is the only river over 6,000 km long that flows entirely within a single country?", options: ["Yangtze", "Nile", "Amazon", "Mississippi"], answer: 0, fact: "The Yangtze runs its full course inside China, unlike the Nile or Amazon which cross national borders." },
  { prompt: "Which river is traditionally listed as the world's longest, though the Amazon disputes the title?", options: ["Nile", "Amazon", "Yangtze", "Mississippi"], answer: 0, fact: "At roughly 6,650 km the Nile is the classic answer, but measurement method can put the Amazon ahead." },
  { prompt: "Which river alone carries roughly one-fifth of all river water that reaches the world's oceans?", options: ["Amazon", "Nile", "Congo", "Yangtze"], answer: 0, fact: "The Amazon's sheer discharge volume dwarfs every other river system on Earth." },
  { prompt: "Which lake is both the world's deepest and its oldest existing freshwater lake?", options: ["Lake Baikal", "Lake Tanganyika", "Lake Superior", "Lake Victoria"], answer: 0, fact: "Lake Baikal plunges to about 1,620 m and formed 20\u201325 million years ago." },
  { prompt: "Which inland body of water is usually described as both the world's largest lake and a sea?", options: ["Caspian Sea", "Lake Superior", "Aral Sea", "Black Sea"], answer: 0, fact: "The Caspian is the largest inland body of water on Earth, often classed as a lake despite its name." },
  { prompt: "Which large lake's shoreline sits at the lowest exposed point of land on Earth?", options: ["Dead Sea", "Lake Assal", "Qattara Depression", "Caspian Sea"], answer: 0, fact: "The Dead Sea shore lies roughly 430 m below sea level." },
  { prompt: "Which lake is widely cited as the world's highest lake navigable by large commercial vessels?", options: ["Lake Titicaca", "Lake Baikal", "Qinghai Lake", "Lake Van"], answer: 0, fact: "Titicaca sits at about 3,810 m on the Peru-Bolivia border." },
  { prompt: "Which \u201clake\u201d has a debated status because it's actually a large inlet connected to the sea by a strait?", options: ["Lake Maracaibo", "Lake Nicaragua", "Lake Chad", "Lake Victoria"], answer: 0, fact: "Venezuela's Lake Maracaibo is really a large inlet of the Caribbean, though it's commonly called a lake." },
  { prompt: "Which mountain's summit is the single point on Earth farthest from the planet's center, ahead of Everest?", options: ["Mount Chimborazo", "Mount Everest", "Denali", "Kilimanjaro"], answer: 0, fact: "Earth's equatorial bulge pushes Ecuador's Chimborazo farther from the planet's core than any other peak." },
  { prompt: "Which mountain is often called taller than Everest when measured base-to-summit rather than from sea level?", options: ["Mauna Kea", "Mount Everest", "K2", "Denali"], answer: 0, fact: "Mauna Kea rises over 10,000 m from its base on the Pacific seafloor to its summit." },
  { prompt: "Which is the only mountain whose summit rises more than 8,848 m above mean sea level?", options: ["Mount Everest", "K2", "Kangchenjunga", "Denali"], answer: 0, fact: "Everest's elevation above sea level, around 8,849 m, remains unmatched by any other peak." },
  { prompt: "Which desert is the only one that covers an entire continent?", options: ["Antarctic Desert", "Sahara Desert", "Arabian Desert", "Gobi Desert"], answer: 0, fact: "By rainfall, Antarctica qualifies as a polar desert and is Earth's driest continent." },
  { prompt: "Which non-polar desert is most often cited as the driest place on Earth?", options: ["Atacama Desert", "Sahara Desert", "Mojave Desert", "Namib Desert"], answer: 0, fact: "Parts of Chile's Atacama can go decades between measurable rainfall." },
  { prompt: "Which desert is most commonly cited as the world's oldest?", options: ["Namib Desert", "Sahara Desert", "Atacama Desert", "Kalahari Desert"], answer: 0, fact: "Namibia's Namib Desert is often dated to at least 55 million years old." },
  { prompt: "Which strait cuts directly through a major world city while marking the boundary between Europe and Asia?", options: ["Bosporus", "Strait of Gibraltar", "Bering Strait", "Strait of Hormuz"], answer: 0, fact: "The Bosporus runs straight through Istanbul, separating its European and Asian sides." },
  { prompt: "Which is the only natural waterway connecting the Atlantic Ocean to the Mediterranean Sea?", options: ["Strait of Gibraltar", "Suez Canal", "Bosporus", "Strait of Sicily"], answer: 0, fact: "Gibraltar, at its narrowest around 14 km, is the only natural channel linking the two." },
  { prompt: "Which is the only strait separating Asia from North America?", options: ["Bering Strait", "Drake Passage", "Strait of Magellan", "Davis Strait"], answer: 0, fact: "The Bering Strait lies between Siberia and Alaska, joining the Arctic and Pacific." },
  { prompt: "Which is the only strait connecting the Red Sea with the Gulf of Aden?", options: ["Bab el-Mandeb", "Strait of Hormuz", "Suez Canal", "Strait of Malacca"], answer: 0, fact: "Bab el-Mandeb sits between the Arabian Peninsula and the Horn of Africa." },
  { prompt: "Which strait is the sole maritime chokepoint between the Persian Gulf and the Gulf of Oman?", options: ["Strait of Hormuz", "Bab el-Mandeb", "Strait of Malacca", "Bosporus"], answer: 0, fact: "Hormuz is the narrow passage linking the Persian Gulf to the Arabian Sea." },
  { prompt: "Which is the only major open-ocean passage separating South America from Antarctica?", options: ["Drake Passage", "Bering Strait", "Strait of Magellan", "Denmark Strait"], answer: 0, fact: "Drake Passage runs between Cape Horn and the South Shetland Islands." },
  { prompt: "Which sea's northern end splits into two narrow gulfs around the Sinai Peninsula?", options: ["Red Sea", "Arabian Sea", "Persian Gulf", "Gulf of Aden"], answer: 0, fact: "The Red Sea forks into the Gulf of Suez and the Gulf of Aqaba on either side of Sinai." },
  { prompt: "Which reef system is often described as the world's largest living structure?", options: ["Great Barrier Reef", "Belize Barrier Reef", "Coral Triangle", "Ningaloo Reef"], answer: 0, fact: "UNESCO describes Australia's Great Barrier Reef as the most extensive coral reef ecosystem on Earth." },

  // ---- Only city that... ----
  { prompt: "Which is the highest de facto national capital in the world, at about 3,640 m?", options: ["La Paz", "Quito", "Thimphu", "Bogot\u00e1"], answer: 0, fact: "La Paz is Bolivia's seat of government, though Sucre is the country's official constitutional capital." },
  { prompt: "Which national capital is the world's lowest-lying, sitting about 28 m below sea level?", options: ["Baku", "Amsterdam", "Copenhagen", "Manama"], answer: 0, fact: "Azerbaijan's Baku sits on the Caspian shoreline below global sea level." },
  { prompt: "Which major city is most famously described as standing on two continents at once?", options: ["Istanbul", "Suez", "Rostov-on-Don", "Orenburg"], answer: 0, fact: "Istanbul straddles the Bosporus, with districts in both Europe and Asia." },
  { prompt: "Which capital's historic centre was in the very first group of UNESCO World Heritage city inscriptions, alongside Krak\u00f3w?", options: ["Quito", "Cusco", "Cairo", "Lima"], answer: 0, fact: "Ecuador's Quito was inscribed in 1978, one of the earliest World Heritage cities on record." },
  { prompt: "Which city contains an entire independent sovereign state within it?", options: ["Rome", "Jerusalem", "Geneva", "Brussels"], answer: 0, fact: "Vatican City is a fully independent enclave surrounded by the city of Rome." },
  { prompt: "Which is the world's northernmost national capital of a sovereign state?", options: ["Reykjavik", "Oslo", "Helsinki", "Nuuk"], answer: 0, fact: "Iceland's Reykjavik holds the record among sovereign-state capitals for its far-north latitude." },
  { prompt: "Which is the world's southernmost national capital of a sovereign state?", options: ["Wellington", "Canberra", "Buenos Aires", "Ushuaia"], answer: 0, fact: "New Zealand's Wellington sits at the southern tip of the North Island." },
  { prompt: "Which national capital is most often cited as the coldest in the world?", options: ["Ulaanbaatar", "Ottawa", "Astana", "Moscow"], answer: 0, fact: "Mongolia's Ulaanbaatar has a severe continental climate with brutal winters." },
  { prompt: "Which purpose-built national capital has one of the smallest populations of any capital, often cited under 500 residents?", options: ["Ngerulmud", "Naypyidaw", "Putrajaya", "Nur-Sultan"], answer: 0, fact: "Palau's capital, Ngerulmud, was purpose-built and remains sparsely populated." },
  { prompt: "Which district serves as the seat of national government in a country that has no official capital city?", options: ["Yaren", "Funafuti", "Majuro", "South Tarawa"], answer: 0, fact: "Nauru has no designated capital, but its government offices sit in Yaren District." },
  { prompt: "Which capital city faces another national capital directly across a river, making them the world's closest capital pair?", options: ["Kinshasa", "Buenos Aires", "Windhoek", "Lusaka"], answer: 0, fact: "DR Congo's Kinshasa and the Republic of Congo's Brazzaville sit across the Congo River from one another." },
  { prompt: "Which national capital is frequently cited among the world's oldest continuously inhabited cities?", options: ["Damascus", "Beirut", "Amman", "Baghdad"], answer: 0, fact: "Syria's Damascus has a settlement history stretching back thousands of years." },
  { prompt: "Which Argentine city markets itself as the world's southernmost city, a claim Chile's Puerto Williams disputes?", options: ["Ushuaia", "Punta Arenas", "Puerto Williams", "Invercargill"], answer: 0, fact: "Ushuaia sits on Tierra del Fuego near South America's southern tip." },
  { prompt: "Which capital city was built directly on the ruins of the Aztec island capital of Tenochtitlan?", options: ["Mexico City", "Lima", "Bogot\u00e1", "Guatemala City"], answer: 0, fact: "Mexico City rose on the site of Tenochtitlan, once an island city in Lake Texcoco." },
  { prompt: "Which city is the only sovereign island city-state in Southeast Asia?", options: ["Singapore", "Brunei", "Monaco", "Malta"], answer: 0, fact: "Singapore is both a city and a fully independent island nation off the Malay Peninsula." },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 15;

// Compass rose, used as the signature decorative element.
function CompassRose({ spin }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-16 h-16 md:w-20 md:h-20 transition-transform duration-700 ease-out ${
        spin ? "rotate-[420deg]" : ""
      }`}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="#c08a3e" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#c08a3e" strokeWidth="0.75" opacity="0.6" />
      <polygon points="50,6 57,50 50,94 43,50" fill="#c08a3e" />
      <polygon points="6,50 50,43 94,50 50,57" fill="#c08a3e" opacity="0.55" />
      <circle cx="50" cy="50" r="4.5" fill="#f3ead4" stroke="#c08a3e" strokeWidth="1.5" />
      <text x="50" y="16" textAnchor="middle" fontSize="8" fill="#f3ead4" fontFamily="Georgia, serif">N</text>
      <text x="50" y="90" textAnchor="middle" fontSize="7" fill="#f3ead4" fontFamily="Georgia, serif" opacity="0.8">S</text>
      <text x="14" y="53" textAnchor="middle" fontSize="7" fill="#f3ead4" fontFamily="Georgia, serif" opacity="0.8">W</text>
      <text x="86" y="53" textAnchor="middle" fontSize="7" fill="#f3ead4" fontFamily="Georgia, serif" opacity="0.8">E</text>
    </svg>
  );
}

export default function App() {
  const [phase, setPhase] = useState("start"); // start | quiz | end
  const [round, setRound] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [spin, setSpin] = useState(false);

  const startGame = useCallback(() => {
    const picked = shuffle(BANK).slice(0, ROUND_SIZE).map((q) => {
      const optionOrder = shuffle(q.options.map((opt, i) => ({ opt, i })));
      return {
        prompt: q.prompt,
        fact: q.fact,
        options: optionOrder.map((o) => o.opt),
        answer: optionOrder.findIndex((o) => o.i === q.answer),
      };
    });
    setRound(picked);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setPhase("quiz");
  }, []);

  const current = round[index];

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setSpin(true);
    setTimeout(() => setSpin(false), 700);
    if (i === current.answer) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= round.length) {
      setPhase("end");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const progressPct = useMemo(
    () => (round.length ? Math.round(((index + (selected !== null ? 1 : 0)) / round.length) * 100) : 0),
    [index, selected, round.length]
  );

  const Shell = ({ children }) => (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{
        background: "radial-gradient(ellipse at top, #1c332c 0%, #12211f 55%, #0d1917 100%)",
      }}
    >
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div
      className={`rounded-sm border ${className}`}
      style={{ background: "#f3ead4", borderColor: "#c08a3e", boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)" }}
    >
      {children}
    </div>
  );

  if (phase === "start") {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center gap-6">
          <CompassRose spin={false} />
          <div>
            <p className="uppercase tracking-[0.3em] text-xs mb-2" style={{ color: "#c08a3e", fontFamily: "Georgia, serif" }}>
              Field Atlas No. 1
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#f3ead4", fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Only One on Earth
            </h1>
            <p className="mt-3 text-sm md:text-base" style={{ color: "#a8c2b6" }}>
              Superlative geography trivia, drawn from a bank of {BANK.length} sourced facts.
              {" "}{ROUND_SIZE} questions per round, shuffled fresh every time.
            </p>
          </div>
          <Card className="w-full p-6 text-left">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#7a6a45" }}>How it works</p>
            <ul className="space-y-1.5 text-sm" style={{ color: "#3a2f1c", fontFamily: "Georgia, serif" }}>
              <li>&mdash; Pick the one correct answer out of four.</li>
              <li>&mdash; Every question comes with a fact once you answer.</li>
              <li>&mdash; Chain correct answers to build a streak.</li>
            </ul>
          </Card>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-sm font-semibold tracking-wide uppercase text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#c08a3e", color: "#12211f" }}
          >
            Begin the round
          </button>
        </div>
      </Shell>
    );
  }

  if (phase === "end") {
    const pct = Math.round((score / round.length) * 100);
    let verdict = "Novice cartographer";
    if (pct >= 90) verdict = "Master of superlatives";
    else if (pct >= 70) verdict = "Seasoned navigator";
    else if (pct >= 50) verdict = "Competent wayfinder";

    return (
      <Shell>
        <div className="flex flex-col items-center text-center gap-6">
          <CompassRose spin={false} />
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#f3ead4", fontFamily: "Georgia, serif" }}>
            Round complete
          </h1>
          <Card className="w-full p-8">
            <p className="text-6xl font-bold" style={{ color: "#12211f", fontFamily: "Georgia, serif" }}>
              {score}
              <span className="text-2xl" style={{ color: "#7a6a45" }}> / {round.length}</span>
            </p>
            <p className="mt-2 text-sm tracking-wide uppercase" style={{ color: "#7a6a45" }}>{verdict}</p>
            <div className="mt-5 flex justify-center gap-8 text-sm" style={{ color: "#3a2f1c" }}>
              <div>
                <p className="font-mono text-xl font-bold">{pct}%</p>
                <p className="uppercase text-xs tracking-widest" style={{ color: "#7a6a45" }}>Accuracy</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold">{bestStreak}</p>
                <p className="uppercase text-xs tracking-widest" style={{ color: "#7a6a45" }}>Best streak</p>
              </div>
            </div>
          </Card>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-sm font-semibold tracking-wide uppercase text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#c08a3e", color: "#12211f" }}
          >
            Play another round
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest" style={{ color: "#7a9a8a" }}>
              Question {index + 1} of {round.length}
            </p>
            <div className="w-40 md:w-56 h-1 mt-2 rounded-full overflow-hidden" style={{ background: "#2a3f37" }}>
              <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: "#c08a3e" }} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-lg font-bold" style={{ color: "#f3ead4" }}>{score}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "#7a9a8a" }}>score</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold" style={{ color: "#c08a3e" }}>{streak}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "#7a9a8a" }}>streak</p>
            </div>
            <CompassRose spin={spin} />
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold leading-snug" style={{ color: "#12211f", fontFamily: "Georgia, serif" }}>
            {current.prompt}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.answer;
              const isChosen = i === selected;
              let style = { background: "#efe3c7", borderColor: "#d8c69a", color: "#12211f" };
              if (selected !== null) {
                if (isCorrect) style = { background: "#3f6b4a", borderColor: "#3f6b4a", color: "#f3ead4" };
                else if (isChosen) style = { background: "#a4462f", borderColor: "#a4462f", color: "#f3ead4" };
                else style = { background: "#efe3c7", borderColor: "#d8c69a", color: "#8a7d5c", opacity: 0.6 };
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  className="text-left px-4 py-3 rounded-sm border text-sm md:text-base font-medium transition-colors"
                  style={style}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "#d8c69a" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#3a2f1c" }}>
                <span className="font-semibold">{selected === current.answer ? "Correct. " : "Not quite. "}</span>
                {current.fact}
              </p>
              <button
                onClick={next}
                className="mt-4 px-6 py-2.5 rounded-sm font-semibold tracking-wide uppercase text-xs"
                style={{ background: "#12211f", color: "#f3ead4" }}
              >
                {index + 1 >= round.length ? "See results" : "Next question"}
              </button>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
