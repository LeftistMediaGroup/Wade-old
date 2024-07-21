// Allow require
import { createRequire } from "module";

const require = createRequire(import.meta.url);
//End require


const NodeMediaServer = require('node-media-server');


export default function SundaySocial() {

    const config = {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: 8000,
            mediaroot: './media',
            allow_origin: '*'
        },
        https: {
            port: 8445,
            key: '.ssl/home.tail5cd89.ts.net.key',
            cert: '.ssl/home.tail5cd89.ts.net.crt',
        },
        trans: {
            ffmpeg: '/usr/local/bin/ffmpeg',
            tasks: [
                {
                    app: 'live',
                    vc: "copy",
                    vcParam: [],
                    ac: "aac",
                    acParam: ['-ab', '64k', '-ac', '1', '-ar', '44100'],
                    rtmp: true,
                    rtmpApp: 'live2',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }
    };
    var nms = new NodeMediaServer(config)
    nms.run();
}