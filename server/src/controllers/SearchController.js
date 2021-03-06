const { Kanji, Component } = require('../models')

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
        attributes: ['gaiji','part'],
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
        selectedParts: searchKeyArray
      }
      res.send(result)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to search kanji'
      })
    }
  },
  async components(req, res) {
    try {
      let components = null
      components = await Component.findAll({
        attributes: ['stroke','part']
      })

      const result = _(components)
        .groupBy(x => x.stroke)
        // .map((value, key) => ({ "stroke" : key, "part": _.map(value, 'part') }))
        .map((value, key) => ({ "stroke" : key, "part": value }))

      res.send(result)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to search components'
      })
    }
  },
  index(req, res) {
    console.log(req.body)
    res.status(500).send({
      error: 'Ahihi nani yatterun no!'
    })
  }
}