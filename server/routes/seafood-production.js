const {executeSparql} = require("../rdf-store-connector");

const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  executeSparql(`
    PREFIX osnm: <http://www.oilspillsnear.me/>
    PREFIX time: <http://www.w3.org/2006/time#>
    
    SELECT DISTINCT ?countryName ?time ?amount
    WHERE {
      ?seafoodProduction a osnm:SeaFoodProduction .
      ?seafoodProduction osnm:countryName ?countryName .
      ?seafoodProduction time:year ?time .
      ?seafoodProduction osnm:hasAmountSeafoodProduction ?amount .
    }
  `, {
    reasoning: true
  }).then(({body}) => {
    res.json(body.results.bindings.map(binding => ({
      countryName: binding.countryName.value,
      time: binding.time.value,
      amount: binding.amount.value,
    })))
  });
});

module.exports = router;
