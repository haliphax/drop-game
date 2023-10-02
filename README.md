# phaxDrop

My personal interpretation of the [PixelPlush] "drop game", implemented using
the [Phaser] JavaScript game engine and [Twitch]'s [tmi.js] library. There is
no server-side code in this project; it relies entirely on client-side code and
the localStorage data store.

## Commands

The following commands may be used in the Twitch channel where the overlay is
connected. Some require that the user be either a moderator or the broadcaster.

| Command                                 | Access    | Description                                                                                                      |
| --------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `!clearscores [username] [username...]` | Moderator | Reset the overlay's localStorage, clearing score records. If no usernames are provided, all records are wiped.   |
| `!commands`                             | Everyone  | A link to this README section.                                                                                   |
| `!drop`                                 | Everyone  | Play the game!                                                                                                   |
| `!droplow`                              | Everyone  | Show the lowest score from the last 24 hours.                                                                    |
| `!droprecent`                           | Everyone  | Show the most recent drop scores.                                                                                |
| `!droptop`                              | Everyone  | Show the top score from the last 24 hours.                                                                       |
| `!help`                                 | Everyone  | Alias for `!commands`.                                                                                           |
| `!queuedrop [seconds]`                  | Moderator | Begin a drop queue. The game either begins when `!startdrop` is called or after the number of seconds specified. |
| `!resetdrop`                            | Moderator | Reset an in-progress drop game.                                                                                  |
| `!startdrop`                            | Moderator | Drop everyone in the queue simultaneously.                                                                       |

## Browser source

### URL

Visit https://haliphax.github.io/drop-game/ and authorize the application via
your Twitch account. Fill out and submit the _Overlay URL builder_ form. Copy
the URL from your browser and add it as a browser source in your streaming
software of choice.

### Configuration

There are several options you can play with that are exposed as optional URL
hash parameters. Each of these (except for `demo`) is configurable from the
_Overlay URL builder_ form you are presented with during the OAuth flow after
logging into Twitch and authorizing the app.

| Key             | Default   | Description                                                                               |
| --------------- | --------- | ----------------------------------------------------------------------------------------- |
| `demo`          | undefined | If this key is present, the background of the game will be set to dark gray (for testing) |
| `gravity`       | 400       | The gravity to apply to sprites before their parachute is open                            |
| `gravity_chute` | 60        | The gravity to apply to sprites once their parachute is open                              |
| `max_velocity`  | 600       | The maximum velocity of sprites (horizontal motion)                                       |
| `wait`          | 60        | The number of seconds to wait (after the last drop has landed) before resetting the game  |

[Phaser]: https://phaser.io
[PixelPlush]: https://pixelplush.dev
[Twitch]: https://twitch.tv
[tmi.js]: https://tmijs.org
