var express = require('express');
var router = express.Router();
var monk = require('monk');
var utils = require('../utils'); var db = monk(utils.getConfig('mongodbPath'));
var btoa = require('btoa'); var nobi = require('nobi'); var crypto = require('crypto');
var signer = nobi(utils.getConfig('appKey'));
var uuid = require('node-uuid');
var util = require('util');
var moment = require('moment');
var dbhelper = require('../db/db');
var Action = require('../lib/common/action');

//router.get('/supadmin/users/:compid',Action('Comp.searchUserById'))
router.get('/supadmin/search',Action('Comp.searchCompView'))
router.get('/supadmin/add',Action('Comp.addCompView'))
router.get('/supadmin/change/:compid',Action('Comp.changeView'))
router.post('/supadmin/search',Action('Comp.searchOneComp'))//searchone  comp in the list
router.post('/supadmin/delete/:compid',Action('Comp.delCompById'))//delete comp in list
router.post('/supadmin/add',Action('Comp.addComp'))//add comp
router.post('/supadmin/change/:compid',Action('Comp.changeCompById'))//changecomp
