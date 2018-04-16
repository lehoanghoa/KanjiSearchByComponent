const { Kanji } = require('../models')
const config = require('../config/config')
const part = require('path')
var _ = require('lodash');

module.exports = {
  async search(req, res) {
    try {
      let kanjis = null
      const searchKey = req.query.key
      if (!searchKey) {
        return res.status(400).send({
          error: 'You Query is null'
        })
      }
      const searchKeyArray = _.map(_.uniq(searchKey.split(',').filter(Boolean)), _.trim)
      kanjis = await Kanji.findAll({
        where: {
          $and: searchKeyArray.map(key => ({
            'part': {
              $like: `%${key}%`
            }
          }))
        }
      })
      const uniqParts = _.uniq(_.flatMap(kanjis, p => p.part.split(' ')))
      const result = {
        gaijis: _.flatMap(kanjis, 'gaiji'),
        parts: _.differenceWith(uniqParts, searchKeyArray, _.isEqual),
        selectedParts: _.intersectionWith(uniqParts, searchKeyArray, _.isEqual)
      }
      res.send(result)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to search kanji'
      })
    }
  }
}