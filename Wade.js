// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as express_init from "./modules/expressInit.js";

import {start} from "./modules/accountInit.js";

start();