# [v2.5.0](https://github.com/haliphax/drop-game/compare/v2.4.1...v2.5.0) (2023-10-30)

## ✨ New Features
- [`f27c8c5`](https://github.com/haliphax/drop-game/commit/f27c8c5)  &quot;bounce&quot; off world boundary walls

# [v2.4.1](https://github.com/haliphax/drop-game/compare/v2.4.0...v2.4.1) (2023-10-04)

## 🐛 Bug Fixes
- [`02cbf15`](https://github.com/haliphax/drop-game/commit/02cbf15)  fix missing username in twitch irc login

# [v2.4.0](https://github.com/haliphax/drop-game/compare/v2.3.0...v2.4.0) (2023-10-04)

## ✨ New Features
- [`7fddc19`](https://github.com/haliphax/drop-game/commit/7fddc19)  scale to fit screen 

## 🐛 Bug Fixes
- [`7584dce`](https://github.com/haliphax/drop-game/commit/7584dce)  fix avatar bounce

# [v2.3.0](https://github.com/haliphax/drop-game/compare/v2.2.0...v2.3.0) (2023-10-04)

## ✨ New Features
- [`d298e0f`](https://github.com/haliphax/drop-game/commit/d298e0f)  reduce horizontal speed when bumping into wall

# [v2.2.0](https://github.com/haliphax/drop-game/compare/v2.1.0...v2.2.0) (2023-10-03)

## ✨ New Features
- [`7c1def1`](https://github.com/haliphax/drop-game/commit/7c1def1)  emote parameter for !drop command 

## 🐛 Bug Fixes
- [`3db185c`](https://github.com/haliphax/drop-game/commit/3db185c)  fix collision box for scaled emotes

# [v2.1.0](https://github.com/haliphax/drop-game/compare/v2.0.0...v2.1.0) (2023-10-02)

## ✨ New Features
- [`53054b1`](https://github.com/haliphax/drop-game/commit/53054b1)  add config options to overlay builder 

## 🐛 Bug Fixes
- [`2502df5`](https://github.com/haliphax/drop-game/commit/2502df5)  point directly to index.html with oauth form 
- [`6699127`](https://github.com/haliphax/drop-game/commit/6699127)  fix oauth flow

# [v2.0.1](https://github.com/haliphax/drop-game/compare/v2.0.0...v2.0.1) (2023-10-02)

## 🐛 Bug Fixes
- [`2502df5`](https://github.com/haliphax/drop-game/commit/2502df5)  point directly to index.html with oauth form

<a name="2.0.0"></a>
## 2.0.0 (2022-03-30)

### Fixed

- 🐛 fix util reference in oauth.js [[653fbb1](https://github.com/haliphax/drop-game/commit/653fbb1b6213415ba14c3af0829b1a935dc1ed59)]

### Miscellaneous

- 📝 update URL examples in README to use hash [[9a41752](https://github.com/haliphax/drop-game/commit/9a417523639ec368201a689ff68deb94c47569ac)]
-  👷 fix publish workflow to point to new static folder [[d0e9e81](https://github.com/haliphax/drop-game/commit/d0e9e8106447f9e645a433cd1d5b86a0e2a45ca9)]
- 💥 reorg, use hash instead of querystring [[4b279e1](https://github.com/haliphax/drop-game/commit/4b279e1eba136f5b10e33ffed54e17e638b17f98)]


<a name="1.3.0"></a>
## 1.3.0 (2021-11-24)

### Added

- ✨ help command (and alias) [[ba1c26e](https://github.com/haliphax/drop-game/commit/ba1c26e7ed0a31e57fccae60a7b93d8acb3263e3)]


<a name="1.2.0"></a>
## 1.2.0 (2021-11-24)

### Added

- ✨ arguments for clearscores command [[21eb36a](https://github.com/haliphax/drop-game/commit/21eb36a1ad639f87d5f20064ef63da5ac2869904)]

### Miscellaneous

- 📝 update README with OAuth info [[9830572](https://github.com/haliphax/drop-game/commit/98305726c2ee9681fd79847b1fb725351cd25c5c)]


<a name="1.1.2"></a>
## 1.1.2 (2021-11-17)

### Added

- ✨ first pass at oauth flow [[c13bdca](https://github.com/haliphax/drop-game/commit/c13bdcad112ef86f783bb16b7bc46ea94031107b)]
- ✨ add hash parsing to querystring.js [[543bec4](https://github.com/haliphax/drop-game/commit/543bec492538b9f9a9fde635ca17ad0545aad77d)]

### Changed

- 💄 viewport meta tag [[9153600](https://github.com/haliphax/drop-game/commit/91536004022a16ebb3b6a9279afb234bea923cf6)]


<a name="1.0.2"></a>
## 1.0.2 (2021-10-28)

### Added

- ✨ debugging features [[49eb408](https://github.com/haliphax/drop-game/commit/49eb40874e598902eb42aa4af39ae392009ba20a)]

### Changed

- ♻️ more constants and some tidying [[853b216](https://github.com/haliphax/drop-game/commit/853b216e1437d94d32b0bbf18bc32fc1b7717130)]

### Fixed

- 🐛 FINALLY fix negative score bug FOR REAL [[4686a77](https://github.com/haliphax/drop-game/commit/4686a7710dfd47d799ad9af4eacaf9a4904710d7)]

### Miscellaneous

- 🩹 fix score label position [[352f57d](https://github.com/haliphax/drop-game/commit/352f57d23c320d1f0e2098adf05930b9e02427fd)]


<a name="1.0.1"></a>
## 1.0.1 (2021-10-26)

### Fixed

- ✏️ gravy -&gt; gravity 🤣 [[49e5a58](https://github.com/haliphax/drop-game/commit/49e5a5832bb39d5f053a8b304774c2ba0dd53402)]

### Miscellaneous

- 💡 add todo re: command timeouts [[5d3ede2](https://github.com/haliphax/drop-game/commit/5d3ede2b5216e0cfb6df5bde185566bdf201f018)]


<a name="1.0.0"></a>
## 1.0.0 (2021-10-25)

### Added

- ✨ pass velocity in via query string value [[9754331](https://github.com/haliphax/drop-game/commit/97543315f803e97e0adbd0ac09171cff3d75beb4)]
- ✨ &quot;bump&quot; sprites on collision [[2574cdc](https://github.com/haliphax/drop-game/commit/2574cdcbc6dc807e5283e78f6f4ec672b47ffd12)]
- ✨ scorekeeping and associated commands [[e8bf4df](https://github.com/haliphax/drop-game/commit/e8bf4df7b382d73c9da3dbbb0fb6addf47903dc3)]
- ✨ multiple drop sprites [[490c631](https://github.com/haliphax/drop-game/commit/490c63142a89e78622bbdb3a31c665c5059b9f5c)]
- ✨ clearscores command [[fc8f861](https://github.com/haliphax/drop-game/commit/fc8f861868a043ad6ce9369c68be92bf1467510b)]
- ✨ actually make sprites pushable, unlike last time [[14878df](https://github.com/haliphax/drop-game/commit/14878df95cfaa8c8e014dbe12eed23a5a9f45e96)]
- ✨ add parachute [[74d53c5](https://github.com/haliphax/drop-game/commit/74d53c50793f58e6fb74bf5021daf2c12cda1377)]
- ✨ resetdrop command [[246bb73](https://github.com/haliphax/drop-game/commit/246bb73d47b7fe418940ebc861cdd8867e40b0bf)]
- ✨ queuedrop, startdrop commands [[1b64fdc](https://github.com/haliphax/drop-game/commit/1b64fdc0c2cc9e73b5508749c31ef7e6c3a9db38)]
- ✨ variable gravity from query string, more realistic parachute gravity [[87dcd2f](https://github.com/haliphax/drop-game/commit/87dcd2fdb275a1f74445d064e46f75982452f908)]
- ✨ pass wait time in query string, fallback to default [[46711b7](https://github.com/haliphax/drop-game/commit/46711b703282cd2c8a180fd6c8a3405546c72119)]
- ✨ sprites collide with each other [[968fa96](https://github.com/haliphax/drop-game/commit/968fa961ec68bd6eaa0403777379bc90c218b68f)]
- ✨ modular architecture, only one winner per game [[334b76e](https://github.com/haliphax/drop-game/commit/334b76e2d385f3620d750a2480fa3195a1e44631)]
- ✨ score display [[08dd982](https://github.com/haliphax/drop-game/commit/08dd98234083aed36abdea89bb8ecf5ba7dff7a3)]
- ✨ simple twitch chat command to start drop [[43aef90](https://github.com/haliphax/drop-game/commit/43aef90cc8ce00f353f0a5d7a57a3ab96cb85d11)]
- 🎉 initial commit [[92720a7](https://github.com/haliphax/drop-game/commit/92720a759c9c9746a022db9a5379b1704e6444a6)]

### Changed

- ♻️ consistent angle assignment (sprite always follows chute) [[05eac23](https://github.com/haliphax/drop-game/commit/05eac23a4754b8da2fd19173fbb3ecb6ab19390b)]
- 🎨 formatting [[75cff9f](https://github.com/haliphax/drop-game/commit/75cff9fc9a18d38f3be4ad92f4e72fc5fce85bcf)]
- ♻️ refactor [[f3ac1b0](https://github.com/haliphax/drop-game/commit/f3ac1b07fe33c81330f7bed12cdc8a7d3395e6dd)]
- 💄 demo mode, transparent background by default [[9a59c12](https://github.com/haliphax/drop-game/commit/9a59c123544dd159f30cf3032e8d654033232af4)]
- 💄 add emotes to all chat output [[c66d692](https://github.com/haliphax/drop-game/commit/c66d6922b22ad8b9e2ce75471f663a8cae73c578)]
- 💄 increase font size of name label, stroke thickness for both labels [[05e5193](https://github.com/haliphax/drop-game/commit/05e519348fb04b572057955840e978de6fb192e5)]
- 🚸 reduce default gravity and max velocity [[64a4525](https://github.com/haliphax/drop-game/commit/64a452505bd205524d613bf02a7185faaaacbd5d)]
- 💄 updated pad sprite [[077e10f](https://github.com/haliphax/drop-game/commit/077e10f9972c3eb0e0cf0adb7388d05f9932fb68)]
- 💄 randomize starting angle [[d18b551](https://github.com/haliphax/drop-game/commit/d18b551317ceaeaad54a2bc4fecaf7a9e13e8425)]
- ♻️ move preload method above create method [[8ace9b9](https://github.com/haliphax/drop-game/commit/8ace9b90cf4ab99dc6234d7cb9357c26010ce06b)]
- ♻️ reorg classes so that avatar needs no permanent reference to game [[ec7311f](https://github.com/haliphax/drop-game/commit/ec7311ff89b7d006e5f1e841d1d04828a5bbeb78)]
- 🎨 alphabetically order twitch imports [[f1869c8](https://github.com/haliphax/drop-game/commit/f1869c8e93ad8852f12e32879a9756dfdbd38433)]
- 💄 gentle swaying motion [[5657582](https://github.com/haliphax/drop-game/commit/565758204eb7b2a27171cc0fcc486c354c66b418)]
- 🎨 mark land method as private [[d880690](https://github.com/haliphax/drop-game/commit/d8806907cfce6c51e837fabac2daefa59b1bbb57)]
- 🎨 use null conditional operator [[32f06cf](https://github.com/haliphax/drop-game/commit/32f06cf0bfe71b33c49fbd904da22c84ceab354d)]
- 🎨 reorg property assignment for logical order [[3de3ac5](https://github.com/haliphax/drop-game/commit/3de3ac571b1da1ba02a3b9ec3d3b1cb3dd05d2cc)]
- ⚡ move win check to avatar class, optimize loops with droppersArray [[0870957](https://github.com/haliphax/drop-game/commit/0870957bc84a4e62857fb0935c7930a7f7a9eb53)]
- ♻️ bundle sprite creation with property modifications [[70b04c5](https://github.com/haliphax/drop-game/commit/70b04c5523e1db731091e56dd591a11448da9631)]
- ♻️ minor clarification of mathematical operation [[0341fce](https://github.com/haliphax/drop-game/commit/0341fced6c6dc395061fbeb6e6c11808f9e5a134)]
- ♻️ introduce constant for maximum random velocity [[34da129](https://github.com/haliphax/drop-game/commit/34da129d9b5bc34173020fd76f057184ea30bd43)]
- ♻️ introduce constant for pad scale [[5dedae6](https://github.com/haliphax/drop-game/commit/5dedae60e1cb27a106c34e6e8ce732c9bc19363c)]
- 💄 increase stroke width on labels [[5ee95a1](https://github.com/haliphax/drop-game/commit/5ee95a178706885edcb5d7c097257beadbc0f78a)]
- ⚡ better lose condition detection [[793f923](https://github.com/haliphax/drop-game/commit/793f92301640227d9e4a22d2599ced8c6c8ca538)]
- ♻️ simplify winner bumping previous winner [[4daaf38](https://github.com/haliphax/drop-game/commit/4daaf3897e560844a11645298a52f10e2c9435ad)]
- 💄 remove extraneous font reference [[a69e9a9](https://github.com/haliphax/drop-game/commit/a69e9a9d7686430236732f8154bcf3186dc16d5a)]
- 🎨 reorg index.js [[225f1e0](https://github.com/haliphax/drop-game/commit/225f1e05bfffa810650f84a8c8780e93bec1d57c)]
- 💄 favicon and title [[f0e210a](https://github.com/haliphax/drop-game/commit/f0e210a30b732a49f2fb2a244502fe37803a7d39)]
- 🎨 add structure to support more commands [[2951684](https://github.com/haliphax/drop-game/commit/2951684c4a27893925e0f5b44350c63a3ce5c1a4)]
- ♻️ use group collider for sprites vs. pad [[945e9e2](https://github.com/haliphax/drop-game/commit/945e9e2575064cb93458595834f4f43fd7b0883e)]
- 🎨 format webfontfile because it bothers me [[edaac2d](https://github.com/haliphax/drop-game/commit/edaac2d8295bdba49f8303157214627ba23f53fe)]
- ♻️ use constants for screen dimensions [[e64bb71](https://github.com/haliphax/drop-game/commit/e64bb71c03c9c31dcd44116ef5c1889ef5c973d6)]
- 💄 syne mono font for score [[54a1b2b](https://github.com/haliphax/drop-game/commit/54a1b2b545fd61f95a7cacc59f66c0fe2c2e1746)]
- 💄 simplify styles target [[840a764](https://github.com/haliphax/drop-game/commit/840a764fe159c6598c88df49cd64381ed629b914)]
- 💄 grey background for testing [[0e44196](https://github.com/haliphax/drop-game/commit/0e441965a504027ce080890b1cdc669fe4b9eb71)]

### Removed

- 🔥 remove unused DELAY_CHUTE constant [[69fc240](https://github.com/haliphax/drop-game/commit/69fc240a48234dfab433511cbff1d413d7961b2a)]
- 🔥 remove unused sinceDrop variable [[8a8e85d](https://github.com/haliphax/drop-game/commit/8a8e85d0e9100dc47cf564b0fac550504bab90e9)]
- 🔥 remove debug pad movement [[a837adf](https://github.com/haliphax/drop-game/commit/a837adf2c6afa6ae0552f92c4df3fa3f3d10883d)]

### Fixed

- ✏️ change name of velocity const in constants.js [[903929a](https://github.com/haliphax/drop-game/commit/903929a41d441871d2832ce803b11be5342cefd3)]
- 🐛 disallow new drops while queuedrop is going on [[134f34f](https://github.com/haliphax/drop-game/commit/134f34f7132bf8ad2c600b09060673cc70ec8c8c)]
- 🐛 use non-rotating containers for physics bodies [[d6d15c2](https://github.com/haliphax/drop-game/commit/d6d15c22656679d9ed55e739434d475027221fb0)]
- 🐛 fix scorekeeping and commands [[d647f2d](https://github.com/haliphax/drop-game/commit/d647f2df568972a065667f4fe40a9611d6f44ba4)]
- 🐛 relative assets folder reference [[33a09c0](https://github.com/haliphax/drop-game/commit/33a09c0c4a73ab550f0d1ea05da8943e291d4b01)]
- 🐛 fix score calculation now that sprite origin is center [[c71ff2c](https://github.com/haliphax/drop-game/commit/c71ff2c857be687a59645454e5f0c12e095564cb)]
- 🐛 clear chute on end [[8d34afd](https://github.com/haliphax/drop-game/commit/8d34afd22d0a480b4d0f7e7c94986c59e6ca1539)]
- 🐛 reset winner during start [[c533ef0](https://github.com/haliphax/drop-game/commit/c533ef02911a0128d59c993098c0260fac034984)]
- ✏️ remove stray semicolon [[59b6a3b](https://github.com/haliphax/drop-game/commit/59b6a3b90e63587d407d652be3c2c3137477cb45)]
- 🐛 actually fix score! [[d0b7091](https://github.com/haliphax/drop-game/commit/d0b709160eb32aebfcb02b4bf7f89d72c4fe3754)]
- 🐛 fix scorekeeping boundary [[789f363](https://github.com/haliphax/drop-game/commit/789f3634483ccf722f358ccf21ad9e40cf94b264)]

### Miscellaneous

- 📝 populate readme [[dda8820](https://github.com/haliphax/drop-game/commit/dda88204b38f1d9f04ef5c8906dcc199d17f2507)]
- 📝 add readme [[41fce74](https://github.com/haliphax/drop-game/commit/41fce7468d1800fe48790a6e957fdbca40dfc931)]
- 📄 add license [[937b889](https://github.com/haliphax/drop-game/commit/937b889d9eebc0316c3b96ebce126e1e2a28021a)]
- 🩹 reduce max drop speed [[3bc2e36](https://github.com/haliphax/drop-game/commit/3bc2e362214343937e968b80f7148c7da8a1cd7b)]
- 🩹 add &quot;No data&quot; response to droprecent [[2572cdf](https://github.com/haliphax/drop-game/commit/2572cdf7342478dee3c00b9a5d5c6e3b873991df)]
-  👷 publishing workflow [[654890e](https://github.com/haliphax/drop-game/commit/654890e559f3814c6d48eb6a748a1d07ef400a84)]
- 🩹 fix scoreLabel offset [[3ce4c4c](https://github.com/haliphax/drop-game/commit/3ce4c4c74116351e0b48d90f56f8f14333ed375b)]
- 🩹 reduce maximum velocity to 600 [[0519bcb](https://github.com/haliphax/drop-game/commit/0519bcbbf2b1e990cf8d78e439351201bd9fea25)]
- 🩹 make object pushable instead of reflecting 100% velocity [[b0c26fc](https://github.com/haliphax/drop-game/commit/b0c26fc8a107063ab81a7fef1260d7d29be001b0)]
- 🔀 Merge branch &#x27;master&#x27; of github.com:haliphax/drop-game [[596e7df](https://github.com/haliphax/drop-game/commit/596e7dff1e1dbaef83e417e99638091c721bb91d)]
- 🩹 true 50/50 chance for either direction at drop [[ecebe3f](https://github.com/haliphax/drop-game/commit/ecebe3f3b315438eaa54f88f94cefb4b2ebfa044)]
- 🩹 don&#x27;t check for collision with ceiling [[df2e449](https://github.com/haliphax/drop-game/commit/df2e44954911036b2727a42ac5df02791e02eb80)]
- 🩹 use constants for dimensions when instantiating game [[fbdf712](https://github.com/haliphax/drop-game/commit/fbdf712daa02a60c6432d1e6c88a088e49638c24)]
- 🩹 ignore tmi.min.js in new folder [[399d5ce](https://github.com/haliphax/drop-game/commit/399d5ce358877a6688437c47d85786ea9125b161)]
