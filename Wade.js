// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express_init from "./modules/expressInit.js"


express_init();