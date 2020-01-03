#!/usr/bin/env node
const CreateMD = require('./CreateMD')

const createMD = new CreateMD()

createMD.autoCreateMDFile()

// createMD.createDayNote()