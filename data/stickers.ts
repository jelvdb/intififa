export type StickerType = "foil" | "player" | "team-photo" | "special" | "insert";

export interface Sticker {
  id: string;
  number: number;
  label: string;
  type: StickerType;
}

export interface Section {
  id: string;
  name: string;
  flag: string;
  stickers: Sticker[];
}

const playerData: Record<string, string[]> = {
  alg: ["Raïs M'Bolhi", "Doukha", "Ramy Bensebaini", "Youcef Atal", "Djamel Benlamri", "Andy Delort", "Ismael Bennacer", "Houssem Aouar", "Adem Zorgane", "Sofiane Feghouli", "Riyad Mahrez", "Said Benrahma", "Youcef Belaïli", "Yacine Brahimi", "Ramzi Zerrouki", "Baghdad Bounedjah", "Islam Slimani", "Amine Gouiri"],
  arg: ["Emiliano Martinez", "Nahuel Molina", "Cristian Romero", "Nicolas Otamendi", "Nicolas Tagliafico", "Leonardo Balerdi", "Enzo Fernandez", "Alexis Mac Allister", "Rodrigo De Paul", "Exequiel Palacios", "Leandro Paredes", "Nico Paz", "Franco Mastantuono", "Nico Gonzalez", "Lionel Messi", "Lautaro Martinez", "Julian Alvarez", "Giuliano Simeone"],
  aus: ["Mathew Ryan", "Joe Gauci", "Harry Souttar", "Alessandro Circati", "Jordan Bos", "Aziz Behich", "Cameron Burgess", "Lewis Miller", "Milos Degenek", "Jackson Irvine", "Riley McGree", "Aiden O'Neill", "Connor Metcalfe", "Patrick Yazbek", "Craig Goodwin", "Kusini Vengi", "Nestory Irankunda", "Mohamed Touré"],
  aut: ["Alexander Schlager", "Patrick Pentz", "David Alaba", "Kevin Danso", "Philipp Lienhart", "Stefan Posch", "Phillipp Mwene", "Alexander Prass", "Xaver Schlager", "Marcel Sabitzer", "Konrad Laimer", "Florian Grillitsch", "Nicolas Seiwald", "Romano Schmid", "Patrick Wimmer", "Christoph Baumgartner", "Michael Gregoritsch", "Marko Arnautović"],
  bel: ["Thibaut Courtois", "Arthur Theate", "Timothy Castagne", "Zeno Debast", "Brandon Mechele", "Maxim De Cuyper", "Thomas Meunier", "Youri Tielemans", "Amadou Onana", "Nicolas Raskin", "Alexis Saelemaekers", "Hans Vanaken", "Kevin De Bruyne", "Jérémy Doku", "Charles De Ketelaere", "Leandro Trossard", "Loïs Openda", "Romelu Lukaku"],
  bih: ["Nikola Vasilj", "Amer Dedic", "Sead Kolasinac", "Tarik Muharemovic", "Nihad Mujakic", "Nikola Katic", "Amir Hadziahmetovic", "Benjamin Tahirovic", "Armin Gigovic", "Ivan Sunjic", "Ivan Basic", "Dzenis Burnic", "Esmir Bajraktarevic", "Amar Memic", "Ermedin Demirovic", "Edin Dzeko", "Samed Bazdar", "Haris Tabakovic"],
  bra: ["Alisson", "Bento", "Marquinhos", "Éder Militão", "Gabriel Magalhães", "Danilo", "Wesley", "Lucas Paquetá", "Casemiro", "Bruno Guimarães", "Luiz Henrique", "Vinicius Júnior", "Rodrygo", "João Pedro", "Matheus Cunha", "Gabriel Martinelli", "Raphinha", "Estévão"],
  can: ["Dayne St.Clair", "Alphonso Davies", "Alistair Johnston", "Samuel Adekugbe", "Riche Larvea", "Derek Cornelius", "Moïse Bombito", "Kamal Miller", "Stephen Eustáquio", "Ismaël Koné", "Jonathan Osorio", "Jacob Shaffelburg", "Mathieu Choinière", "Niko Sigur", "Tajon Buchanan", "Liam Millar", "Cyle Larin", "Jonathan David"],
  cpv: ["Vozinha", "Logan Costa", "Pico", "Diney", "Steven Moreira", "Wagner Pina", "Joao Paulo", "Yannick Semedo", "Kevin Pina", "Patrick Andrade", "Jamiro Monteiro", "Deroy Duarte", "Garry Rodrigues", "Jovane Cabral", "Ryan Mendes", "Dailon Livramento", "Willy Semedo", "Bebe"],
  col: ["Camilo Vargas", "David Ospina", "Dávinson Sánchez", "Yerry Mina", "Daniel Munoz", "Johan Mojica", "Jhon Lucumí", "Santiago Arias", "Jefferson Lerma", "Kevin Castaño", "Richard Rios", "James Rodriguez", "Juan Fernando Quintero", "Jorge Carrascal", "Jon Arias", "Jhon Cordova", "Luis Suarez", "Luis Diaz"],
  cod: ["Lionel Mpasi", "Aaron Wan-Bissaka", "Axel Tuanzebe", "Arthur Masuaku", "Chancel Mbemba", "Joris Kayembe", "Charles Pickel", "Ngal'ayel Mukau", "Edo Kayembe", "Samuel Moutoussamy", "Noah Sadiki", "Théo Bongonda", "Meschak Elia", "Yoane Wissa", "Brian Cipenga", "Fiston Mayele", "Cédric Bakambu", "Nathanaël Mbuku"],
  cro: ["Dominik Livaković", "Duje Caleta-Car", "Josko Gvardiol", "Josip Stanišić", "Luka Vušković", "Josip Sutalo", "Kristijan Jakic", "Luka Modrić", "Mateo Kovacic", "Martin Baturina", "Lovro Majer", "Mario Pasalic", "Petar Sucic", "Ivan Perišić", "Marco Pasalic", "Ante Budimir", "Andrej Kramarić", "Franjo Ivanovic"],
  cze: ["Matej Kovar", "Jindrich Stanek", "Ladislav Krejci", "Vladimir Coufal", "Jaroslav Zeleny", "Tomas Holes", "David Zima", "Michal Sadilek", "Lukas Provod", "Lukas Cerv", "Tomas Soucek", "Pavel Sulc", "Matej Vydra", "Vasil Kusej", "Tomas Chory", "Vaclav Cerny", "Adam Hlozek", "Patrik Schick"],
  cur: ["Eloy Room", "Armando Obispo", "Sherel Floranus", "Jurien Gaari", "Joshua Brenet", "Roshon Van Eijma", "Shurandy Sambo", "Livano Comenencia", "Godfried Roemeratoe", "Juninho Bacuna", "Leandro Bacuna", "Tahith Chong", "Kenji Gorre", "Jearl Margaritha", "Jurgen Locadia", "Jeremy Antonisse", "Gervane Kastaneer", "Sontje Hansen"],
  ecu: ["Hernán Galíndez", "Gonzalo Valle", "Piero Hincapié", "Pervis Estupiñán", "Willian Pacho", "Ángelo Preciado", "Joel Ordóñez", "Moises Caicedo", "Alan Franco", "Kendry Paez", "Pedro Vite", "John Veboah", "Leonardo Campana", "Gonzalo Plata", "Nilson Angulo", "Alan Minda", "Kevin Rodriguez", "Enner Valencia"],
  egy: ["Mohamed El Shenawy", "Mohamed Hany", "Mohamed Hamdy", "Yasser Ibrahim", "Khaled Sobhi", "Ramy Rabia", "Hossam Abdelmaguid", "Ahmed Fatouh", "Marwan Attia", "Zizo", "Hamdy Fathy", "Mohamed Lasheen", "Emam Ashour", "Osama Faisal", "Mohamed Salah", "Mostafa Mohamed", "Trezeguet", "Omar Marmoush"],
  eng: ["Jordan Pickford", "John Stones", "Marc Guéhi", "Ezri Konsa", "Trent Alexander-Arnold", "Reece James", "Dan Burn", "Jordan Henderson", "Declan Rice", "Jude Bellingham", "Cole Palmer", "Morgan Rogers", "Anthony Gordon", "Phil Foden", "Bukayo Saka", "Harry Kane", "Marcus Rashford", "Ollie Watkins"],
  fra: ["Mike Maignan", "Theo Hernandez", "William Saliba", "Jules Kounde", "Ibrahima Konate", "Dayot Upamecano", "Lucas Digne", "Aurélien Tchouaméni", "Eduardo Camavinga", "Manu Kone", "Adrien Rabiot", "Michael Olise", "Ousmane Dembele", "Bradley Barcola", "Désiré Doué", "Kingsley Coman", "Hugo Ekitike", "Kylian Mbappe"],
  ger: ["Marc-André ter Stegen", "Jonathan Tah", "David Raum", "Nico Schlotterbeck", "Antonio Rüdiger", "Waldemar Anton", "Ridle Baku", "Maximilian Mittelstadt", "Joshua Kimmich", "Florian Wirtz", "Felix Nmecha", "Leon Goretzka", "Jamal Musiala", "Serge Gnabry", "Kai Havertz", "Leroy Sane", "Karim Adeyemi", "Nick Woltemade"],
  gha: ["Lawrence Ati Zigi", "Tariq Lamptey", "Mohammed Salisu", "Alidu Seidu", "Alexander Djiku", "Gideon Mensah", "Caleb Yirenkyi", "Abdul Issahaku Fatawu", "Thomas Partey", "Salis Abdul Samed", "Kamaldeen Sulemana", "Mohammed Kudus", "Inaki Williams", "Jordan Ayew", "Andrew Ayew", "Joseph Paintsil", "Osman Bukari", "Antoine Semenyo"],
  hai: ["Johny Placide", "Carlens Arcus", "Martin Expérience", "Jean-Kevin Duverne", "Ricardo Adé", "Duke Lacroix", "Garven Metusala", "Hannes Delcroix", "Leverton Pierre", "Danley Jean Jacques", "Jean-Ricner Bellegarde", "Christopher Attys", "Derrick Etienne Jr", "Josue Casimir", "Ruben Providence", "Duckens Nazon", "Louicius Deedson", "Frantzdy Pierrot"],
  irn: ["Alireza Beiranvand", "Morteza Pouraliganji", "Ehsan Hajsafi", "Milad Mohammadi", "Shojae Khalilzadeh", "Ramin Rezaeian", "Hossein Kanaani", "Sadegh Moharrami", "Saleh Hardani", "Saeed Ezatolahi", "Saman Ghoddos", "Omid Noorafkan", "Roozbeh Cheshmi", "Mohammad Mohebi", "Sardar Azmoun", "Mehdi Taremi", "Alireza Jahanbakhsh", "Ali Gholizadeh"],
  irq: ["Jalal Hassan", "Rebin Sulaka", "Hussein Ali", "Akam Hashem", "Merchas Doski", "Zaid Tahseen", "Manaf Younis", "Zidane Iqbal", "Amir Al-Ammari", "Ibrahim Bavesh", "Ali Jasim", "Youssef Amyn", "Aimar Sher", "Marko Farji", "Osama Rashid", "Ali Al-Hamadi", "Aymen Hussein", "Mohanad Ali"],
  civ: ["Yahia Fofana", "Ghislain Konan", "Wilfried Singo", "Odilon Kossounou", "Evan Ndicka", "Willy Boly", "Emmanuel Agbadou", "Ousmane Diomande", "Franck Kessie", "Seko Fofana", "Ibrahim Sangare", "Jean-Philippe Gbamin", "Amad Diallo", "Sébastien Haller", "Simon Adingra", "Yan Diomande", "Evann Guessand", "Oumar Diakite"],
  jpn: ["Zion Suzuki", "Henry Heroki Mochizuki", "Ayumu Seko", "Junnosuke Suzuki", "Shogo Taniguchi", "Tsuyoshi Watanabe", "Kaishu Sano", "Yuki Soma", "Ao Tanaka", "Daichi Kamada", "Takefusa Kubo", "Ritsu Doan", "Keito Nakamura", "Takumi Minamino", "Shuto Machino", "Junya Ito", "Koki Ogawa", "Ayase Ueda"],
  jor: ["Yazeed Abulaila", "Ihsan Haddad", "Mohammad Abu Hashish", "Yazan Al-Arab", "Abdallah Nasib", "Saleem Obaid", "Mohammad Abualnadi", "Ibrahim Saadeh", "Nizar Al-Rashdan", "Noor Al-Rawabdeh", "Mohannad Abu Taha", "Amer Jamous", "Musa Al-Taamari", "Yazan Al-Naimat", "Mahmoud Al-Mardi", "Ali Olwan", "Mohammad Abu Zrayq", "Ibrahim Sabra"],
  mex: ["Luis Malagón", "Johan Vasquez", "Jorge Sánchez", "Cesar Montes", "Jesus Gallardo", "Israel Reyes", "Diego Lainez", "Carlos Rodriguez", "Edson Alvarez", "Orbelin Pineda", "Marcel Ruiz", "Érick Sánchez", "Hirving Lozano", "Santiago Giménez", "Raúl Jiménez", "Alexis Vega", "Roberto Alvarado", "Cesar Huerta"],
  mar: ["Yassine Bounou", "Munir El Kajoui", "Achraf Hakimi", "Noussair Mazraoui", "Nayef Aguerd", "Roman Saiss", "Jawad El Yamio", "Adam Masina", "Sofyan Amrabat", "Azzedine Ounahi", "Eliesse Ben Seghir", "Bilal El Khannouss", "Ismael Saibari", "Youssef En-Nesyri", "Abde Ezzalzouli", "Soufiane Rahimi", "Brahim Diaz", "Ayoub El Kaabi"],
  ned: ["Bart Verbruggen", "Virgil van Dijk", "Micky van de Ven", "Jurrien Timber", "Denzel Dumfries", "Nathan Aké", "Jeremie Frimpong", "Jan Paul van Hecke", "Tijjani Reijnders", "Ryan Gravenberch", "Teun Koopmeiners", "Frenkie de Jong", "Xavi Simons", "Justin Kluivert", "Memphis Depay", "Donyell Malen", "Wout Weghorst", "Cody Gakpo"],
  nzl: ["Max Crocombe", "Alex Paulsen", "Michael Boxall", "Liberato Cacace", "Tim Payne", "Tyler Bindon", "Francis de Vries", "Finn Surman", "Joe Bell", "Sarpreet Singh", "Ryan Thomas", "Matthew Garbett", "Marko Stamenić", "Ben Old", "Chris Wood", "Elijah Just", "Callum McCowatt", "Kosta Barbarouses"],
  nor: ["Orjan Nyland", "Julian Ryerson", "Leo Ostigård", "Kristoffer Ajer", "Marcus Holmgren Pedersen", "David Møller Wolfe", "Torbjørn Heggem", "Morten Thorsby", "Martin Ødegaard", "Sander Berge", "Andreas Schjelderup", "Patrick Berg", "Erling Haaland", "Alexander Sørloth", "Aron Dønnum", "Jorgen Strand Larsen", "Antonio Nusa", "Oscar Bobb"],
  pan: ["Orlando Mosquera", "Luis Mejia", "Fidel Escobar", "Andres Andrade", "Michael Murillo", "Eric Davis", "Jose Cordoba", "Cesar Blackman", "Cristian Martinez", "Aníbal Godoy", "Adalberto Carrasquilla", "Édgar Bárcenas", "Carlos Harvey", "Ismael Díaz", "Jose Fajardo", "Cecilio Waterman", "Jose Luiz Rodriguez", "Alberto Quintero"],
  par: ["Roberto Fernandez", "Orlando Gill", "Gustavo Gomez", "Fabián Balbuena", "Juan José Cáceres", "Omar Alderete", "Junior Alonso", "Mathías Villasanti", "Diego Gomez", "Damián Bobadilla", "Andres Cubas", "Matias Galarza", "Julio Enciso", "Alejandro Romero Gamarra", "Miguel Almirón", "Ramon Sosa", "Angel Romero", "Antonio Sanabria"],
  por: ["Diogo Costa", "Jose Sa", "Ruben Dias", "João Cancelo", "Diogo Dalot", "Nuno Mendes", "Gonçalo Inácio", "Bernardo Silva", "Bruno Fernandes", "Ruben Neves", "Vitinha", "João Neves", "Cristiano Ronaldo", "Francisco Trincao", "João Felix", "Gonçalo Ramos", "Pedro Neto", "Rafael Leão"],
  qat: ["Meshaal Barsham", "Sultan Albrake", "Lucas Mendes", "Homam Ahmed", "Boualem Khoukhi", "Pedro Miguel", "Tarek Salman", "Mohamed Al-Mannai", "Karim Boudiaf", "Assim Madibo", "Ahmed Fatehi", "Mohammed Waad", "Abdulaziz Hatem", "Hassan Al-Haydos", "Edmilson Junior", "Akram Hassan Afif", "Ahmed Al Ganehi", "Almoez Ali"],
  ksa: ["Nawaf Alaqidi", "Abdulrahman Al-Sanbi", "Saud Abdulhamid", "Nawaf Bouwashl", "Jihad Thakri", "Moteb Al-Harbi", "Hassan Altambakti", "Musab Aljuwayr", "Ziyad Aljohani", "Abdullah Alkhaibari", "Nasser Aldawsari", "Saleh Abu Alshamat", "Marwan Alsahafi", "Salem Aldawsari", "Abdulrahman Al-Aboud", "Feras Akbrikan", "Saleh Alshehri", "Abdullah Al-Hamdan"],
  sco: ["Angus Gunn", "Jack Hendry", "Kieran Tierney", "Aaron Hickey", "Andrew Robertson", "Scott McKenna", "John Souttar", "Anthony Ralston", "Grant Hanley", "Scott McTominay", "Billy Gilmour", "Lewis Ferguson", "Ryan Christie", "Kenny McLean", "John McGinn", "Lyndon Dykes", "Che Adams", "Ben Gannon-Doak"],
  sen: ["Edouard Mendy", "Yehvann Diouf", "Moussa Niakhaté", "Abdoulaye Seck", "Ismail Jakobs", "El Hadji Malick Diouf", "Kalidou Koulibaly", "Idrissa Gana Gueye", "Pape Matar Sarr", "Pape Gueye", "Habib Diarra", "Lamine Camara", "Sadio Mane", "Ismaïla Sarr", "Boulaye Dia", "Iliman Ndiaye", "Nicolas Jackson", "Krepin Diatta"],
  rsa: ["Ronwen Williams", "Sipho Chaine", "Aubrey Modiba", "Samukele Kabini", "Mbekezeli Mbokazi", "Khulumani Ndamane", "Siyabonga Ngezana", "Khuliso Mudau", "Nkosinathi Sibisi", "Teboho Mokoena", "Thalente Mbatha", "Bathasi Aubaas", "Yaya Sithole", "Sipho Mbule", "Lyle Foster", "Iqraam Rayners", "Mohau Nkota", "Oswin Appollis"],
  kor: ["Hyeon-woo Jo", "Seung-Gyu Kim", "Min-jae Kim", "Yu-min Cho", "Young-woo Seol", "Han-beom Lee", "Tae-seok Lee", "Myung-jae Lee", "Jae-sung Lee", "In-beom Hwang", "Kang-in Lee", "Seung-ho Paik", "Jens Castrop", "Dongg-yeong Lee", "Gue-sung Cho", "Heung-min Son", "Hee-chan Hwang", "Hyeon-Gyu Oh"],
  esp: ["Unai Simon", "Robin Le Normand", "Aymeric Laporte", "Dean Huijsen", "Pedro Porro", "Dani Carvajal", "Marc Cucurella", "Martín Zubimendi", "Rodri", "Pedri", "Fabian Ruiz", "Mikel Merino", "Lamine Yamal", "Dani Olmo", "Nico Williams", "Ferran Torres", "Álvaro Morata", "Mikel Oyarzabal"],
  swe: ["Victor Johansson", "Isak Hien", "Gabriel Gudmundsson", "Emil Holm", "Victor Nilsson Lindelöf", "Gustaf Lagerbielke", "Lucas Bergvall", "Hugo Larsson", "Jesper Karlström", "Yasin Ayari", "Mattias Svanberg", "Daniel Svensson", "Ken Sema", "Roony Bardghji", "Dejan Kulusevski", "Anthony Elanga", "Alexander Isak", "Viktor Gyökeres"],
  sui: ["Gregor Kobel", "Yvon Mvogo", "Manuel Akanji", "Ricardo Rodriguez", "Nico Elvedi", "Aurèle Amenda", "Silvan Widmer", "Granit Xhaka", "Denis Zakaria", "Remo Freuler", "Fabian Rieder", "Ardon Jashari", "Johan Manzambi", "Michel Aebischer", "Breel Embolo", "Ruben Vargas", "Dan Ndoye", "Zeki Amdouni"],
  tun: ["Bechir Ben Said", "Aymen Dahmen", "Yan Valery", "Montassar Talbi", "Yassine Meriah", "Ali Abdi", "Dylan Bronn", "Ellyes Skhiri", "Aissa Laidouni", "Ferjani Sassi", "Mohamed Ali Ben Romdhane", "Hannibal Mejbri", "Elias Achouri", "Elias Saad", "Hazem Mastouri", "Ismael Gharbi", "Sayfallah Ltaief", "Naim Sliti"],
  tur: ["Ugurcan Cakir", "Mert Muldur", "Zeki Celik", "Abdulkerim Bardakci", "Caglar Soyuncu", "Merih Demiral", "Ferdi Kadioglu", "Kaan Ayhan", "Ismail Yuksek", "Hakan Calhanoglu", "Orkun Kokcu", "Arda Guler", "Irfan Can Kahveci", "Yunus Akgun", "Can Uzun", "Baris Alper Yilmaz", "Kerem Akturkoglu", "Kenan Yildiz"],
  uru: ["Sergio Rochet", "Santiago Mele", "Ronald Araujo", "José María Giménez", "Sebastian Caceres", "Mathias Olivera", "Guillermo Varela", "Nahitan Nandez", "Federico Valverde", "Giorgian De Arrascaeta", "Rodrigo Bentancur", "Manuel Ugarte", "Nicolás de la Cruz", "Maxi Araujo", "Darwin Núñez", "Federico Viñas", "Rodrigo Aguirre", "Facundo Pellistri"],
  usa: ["Matt Freese", "Chris Richards", "Tim Ream", "Mark McKenzie", "Alex Freeman", "Antonee Robinson", "Tyler Adams", "Tanner Tessmann", "Weston McKennie", "Christian Roldan", "Timothy Weah", "Diego Luna", "Malik Tillman", "Christian Pulisic", "Brenden Aaronson", "Ricardo Pepi", "Haji Wright", "Folarin Balogun"],
  uzb: ["Utkir Yusupov", "Farrukh Savfiev", "Sherzod Nasrullaev", "Umar Eshmurodov", "Husniddin Aliqulov", "Rustamjon Ashurmatov", "Khojiakbar Alijonov", "Abdukodir Khusanov", "Odiljon Hamrobekov", "Otabek Shukurov", "Jamshid Iskanderov", "Azizbek Turgunboev", "Khojimat Erkinov", "Eldor Shomurodov", "Oston Urunov", "Jaloliddin Masharipov", "Igor Sergeev", "Abbosbek Fayzullaev"],
};

const countries: { name: string; flag: string; id: string }[] = [
  { id: "alg", name: "Algeria", flag: "🇩🇿" },
  { id: "arg", name: "Argentina", flag: "🇦🇷" },
  { id: "aus", name: "Australia", flag: "🇦🇺" },
  { id: "aut", name: "Austria", flag: "🇦🇹" },
  { id: "bel", name: "Belgium", flag: "🇧🇪" },
  { id: "bih", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { id: "bra", name: "Brazil", flag: "🇧🇷" },
  { id: "can", name: "Canada", flag: "🇨🇦" },
  { id: "cpv", name: "Cape Verde", flag: "🇨🇻" },
  { id: "col", name: "Colombia", flag: "🇨🇴" },
  { id: "cod", name: "Congo DR", flag: "🇨🇩" },
  { id: "cro", name: "Croatia", flag: "🇭🇷" },
  { id: "cze", name: "Czechia", flag: "🇨🇿" },
  { id: "cur", name: "Curaçao", flag: "🇨🇼" },
  { id: "ecu", name: "Ecuador", flag: "🇪🇨" },
  { id: "egy", name: "Egypt", flag: "🇪🇬" },
  { id: "eng", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "fra", name: "France", flag: "🇫🇷" },
  { id: "ger", name: "Germany", flag: "🇩🇪" },
  { id: "gha", name: "Ghana", flag: "🇬🇭" },
  { id: "hai", name: "Haiti", flag: "🇭🇹" },
  { id: "irn", name: "Iran", flag: "🇮🇷" },
  { id: "irq", name: "Iraq", flag: "🇮🇶" },
  { id: "civ", name: "Ivory Coast", flag: "🇨🇮" },
  { id: "jpn", name: "Japan", flag: "🇯🇵" },
  { id: "jor", name: "Jordan", flag: "🇯🇴" },
  { id: "mex", name: "Mexico", flag: "🇲🇽" },
  { id: "mar", name: "Morocco", flag: "🇲🇦" },
  { id: "ned", name: "Netherlands", flag: "🇳🇱" },
  { id: "nzl", name: "New Zealand", flag: "🇳🇿" },
  { id: "nor", name: "Norway", flag: "🇳🇴" },
  { id: "pan", name: "Panama", flag: "🇵🇦" },
  { id: "par", name: "Paraguay", flag: "🇵🇾" },
  { id: "por", name: "Portugal", flag: "🇵🇹" },
  { id: "qat", name: "Qatar", flag: "🇶🇦" },
  { id: "ksa", name: "Saudi Arabia", flag: "🇸🇦" },
  { id: "sco", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "sen", name: "Senegal", flag: "🇸🇳" },
  { id: "rsa", name: "South Africa", flag: "🇿🇦" },
  { id: "kor", name: "South Korea", flag: "🇰🇷" },
  { id: "esp", name: "Spain", flag: "🇪🇸" },
  { id: "swe", name: "Sweden", flag: "🇸🇪" },
  { id: "sui", name: "Switzerland", flag: "🇨🇭" },
  { id: "tun", name: "Tunisia", flag: "🇹🇳" },
  { id: "tur", name: "Türkiye", flag: "🇹🇷" },
  { id: "uru", name: "Uruguay", flag: "🇺🇾" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "uzb", name: "Uzbekistan", flag: "🇺🇿" },
];

function buildCountryStickers(countryId: string, startNumber: number, players: string[]): Sticker[] {
  return [
    { id: `${countryId}-1`, number: startNumber, label: "Logo (Foil)", type: "foil" },
    ...players.map((name, i) => ({
      id: `${countryId}-${i + 2}`,
      number: startNumber + i + 1,
      label: name,
      type: "player" as StickerType,
    })),
    { id: `${countryId}-20`, number: startNumber + 19, label: "Teamfoto", type: "team-photo" },
  ];
}

const specialStickers: Sticker[] = [
  { id: "sp-1",  number: 1,  label: "Panini Logo",                    type: "special" },
  { id: "sp-2",  number: 2,  label: "Officieel Embleem",              type: "special" },
  { id: "sp-3",  number: 3,  label: "Mascotte",                       type: "special" },
  { id: "sp-4",  number: 4,  label: "Slogan",                         type: "special" },
  { id: "sp-5",  number: 5,  label: "Bal",                            type: "special" },
  { id: "sp-6",  number: 6,  label: "Gastland: Canada",               type: "special" },
  { id: "sp-7",  number: 7,  label: "Gastland: Mexico",               type: "special" },
  { id: "sp-8",  number: 8,  label: "Gastland: USA",                  type: "special" },
  { id: "sp-9",  number: 9,  label: "WK Historie: Italië 1934",       type: "special" },
  { id: "sp-10", number: 10, label: "WK Historie: Uruguay 1950",      type: "special" },
  { id: "sp-11", number: 11, label: "WK Historie: W-Duitsland 1954",  type: "special" },
  { id: "sp-12", number: 12, label: "WK Historie: Brazilië 1962",     type: "special" },
  { id: "sp-13", number: 13, label: "WK Historie: W-Duitsland 1974",  type: "special" },
  { id: "sp-14", number: 14, label: "WK Historie: Argentinië 1986",   type: "special" },
  { id: "sp-15", number: 15, label: "WK Historie: Brazilië 1994",     type: "special" },
  { id: "sp-16", number: 16, label: "WK Historie: Brazilië 2002",     type: "special" },
  { id: "sp-17", number: 17, label: "WK Historie: Italië 2006",       type: "special" },
  { id: "sp-18", number: 18, label: "WK Historie: Duitsland 2014",    type: "special" },
  { id: "sp-19", number: 19, label: "WK Historie: Argentinië 2022",   type: "special" },
  { id: "sp-20", number: 20, label: "WK Historie: Extra",             type: "special" },
];

const countryStart = 21;
const countrySections: Section[] = countries.map((country, index) => ({
  id: country.id,
  name: country.name,
  flag: country.flag,
  stickers: buildCountryStickers(
    country.id,
    countryStart + index * 20,
    playerData[country.id] ?? Array.from({ length: 18 }, (_, i) => `Speler ${i + 1}`)
  ),
}));

export const sections: Section[] = [
  { id: "special", name: "Speciaal", flag: "🏆", stickers: specialStickers },
  ...countrySections,
];

export const totalStickers = sections.reduce((sum, s) => sum + s.stickers.length, 0);
