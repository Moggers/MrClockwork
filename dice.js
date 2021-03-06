
module.exports =
{
  processRolls: function(input)
  {
    var inputCopy = input.replace(/\%|\?|\s/g, "");
    var rollList = [];
    var literalList = [];
    var total = 0;
    var msg = "";

    while (/\d+/.test(inputCopy) === true)
    {
      if (/^\+?\d+D\d+/i.test(inputCopy) === true)
      {
        var rollStr = inputCopy.match(/\d+D\d+\+?/i)[0];
        var d = rollStr.toLowerCase().replace(/\+|\s/g, "").split("d");
      	var num = d[0] || 0;
      	var max = d[1] || 0;
      	var explode = false;
        var result;
        rollList.push({num: +num, max: +max});
        inputCopy = inputCopy.slice(inputCopy.indexOf(rollStr) + rollStr.length).trim();

        if (rollStr.includes("+") === true && (inputCopy.length <= 0 || /^\+/.test(inputCopy) === true))
        {
          explode = true;
        }

      	if (isNaN(+num) || isNaN(+max))
      	{
      		return "Make sure you introduce only numbers separated by a 'd', like `?5d6`. Use a + to roll exploding dice.";
      	}

      	if (+num <= 0 || +num > 20  || +max <= 0 || +max > 100)
      	{
      		return "The number of dice must be between 1 and 20 and the dice sides must be between 1 and 100";
      	}

        result = roll(+num, +max, explode);
        total += result;
        msg += result + " + ";
      }

      else if (/^\+?\d+/i.test(inputCopy) === true)
      {
        var nbr = inputCopy.match(/\d+/)[0];
        inputCopy = inputCopy.slice(inputCopy.indexOf(nbr) + nbr.length).trim();

        if (isNaN(+nbr) === true)
        {
          continue;
        }

        total += +nbr;
        msg += +nbr + " + ";
        literalList.push(+nbr);
      }

      else break;
    }

    return (msg.trim().slice(0, msg.lastIndexOf("+")) + "= " + total + " (Avg: " + findAverage(rollList, literalList) + ").").toBox();
  },

  //The Dom4 DRN is a 2d6 roll in which a result of 6 is exploded, but substracting 1 from it.
  DRN: function()
  {
  	return explodeDRN() + explodeDRN();
  },

  DRNvsDRN: function(atkMod = 0, defMod = 0)
  {
    drn1 = DRN();
    drn2 = DRN();
  	return {roll1: drn1 + atkMod, natRoll1: drn1, roll2: drn2 + defMod, natRoll2: drn2, diff: (drn1 + atkMod) - (drn2 + defMod)};
  }
}

function findAverage(rolls, literals)
{
  var result = 0;

  for (var i = 0; i < rolls.length; i++)
  {
    result += ((rolls[i].max + 1) * 0.5) * rolls[i].num;
  }

  for (var j = 0; j < literals.length; j++)
  {
    result += literals[j];
  }

  return Math.round(result);
}

function roll(diceNum, max, explosive = false)
{
  var str = "";
  var total = 0;

  for (var i = 0; i < diceNum; i++)
  {
    var result = Math.floor((Math.random() * max) + 1);

    if (explosive == true && result == max)
    {
      result += explodeDie(max);
    }

    total += result;
  }

  return total;
}

function explodeDie(max)
{
	var rndm = Math.floor((Math.random() * max) + 1);

	if (rndm == max)
	{
		rndm += explodeDie(max);
	}

	return rndm;
}

function explodeDRN()
{
  var rndm = Math.floor((Math.random() * 6) + 1);

  if (rndm == 6)
  {
    rndm += -1 + explodeDRN();
  }

  return rndm;
}
