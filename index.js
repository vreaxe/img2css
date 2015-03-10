#!/usr/bin/env node
'use strict';

var program = require('commander');
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
var Img2CSS = require('./img2css.js');

updateNotifier({pkg: pkg}).notify();

var img2css = new Img2CSS();

program
  .version('0.0.1')
  .option('-i, --image [img]', 'image convert to css')
  .option('--id [id]', 'id of html tag')
  .option('-b, --blur [blur]', 'blur image')
  .option('-m, --minify', 'minify css')
  .parse(process.argv);

if (!program.i && !program.image) {
  throw new Error('-i, --image required');
} else if (!program.id) {
  throw new Error('--id required');
} else {
  if (program.i || program.image) img2css.src = program.i || program.image;
  if (program.id) img2css.id = program.id;
  if (program.b || program.blur) img2css.blur = program.b || program.blur;
  if (program.m || program.minify) img2css.minify = true;
  img2css.convert();
}
