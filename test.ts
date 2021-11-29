import TmdbExtractor from "./index";

const ext = new TmdbExtractor("b1854cc7cd8f2e29da75a04a3c946e44");

ext.extractTmdbId({ title: process.argv.slice(2).join(" "), year: undefined }).then(console.log);