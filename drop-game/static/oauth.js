import { hs } from './querystring.js';

'use strict';

document.querySelector('input[name="oauth"]').value = hs.access_token;
