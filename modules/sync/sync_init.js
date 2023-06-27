import InputFolderRead from "../routes/sync/InputFolderRead.js";
import { InputToDatabase } from "./InputToDatabase.js";

export default class SyncInit {
  constructor() {
    console.log(`\nSyncInit Start`);

    let filepath = `./modules/sync/input/test4.txt`;
    let folderPath = "./modules/sync/input";
    let filenameO = filepath.split("/");
    let filename = filenameO[4];

    console.log(`FileName: ${filename}\n`);

    //InputFolderRead(folderPath);
  }
}
