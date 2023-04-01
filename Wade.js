// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "./modules/express.js"


express();