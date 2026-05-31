function createList(divID) {

// Base Variables
  var rawText = document.getElementById("pokelist").value; // pulls from textarea
  var invite = document.getElementById("inviteType").value // pulls invite type (i.e Gilded, Fancy...)
  var rawList = [] // where the full list of pokemon will be put
  var pokeroll = [] // specific rolled pokemon
  var flr = 10 // total  of pokemon that will be pulled

  rawList = rawText.split("\n").map(item => item.trim()); // splits Pokemon list into a workable array
  var listLength = rawList.length

// sets flr higher if using a fusion type invite
  if (invite != "fusion" && invite != "fusionEX") {
    flr = 10
  } else if (listLength > 20) {
    flr = 20
  } else {
    flr = listLength
  }

  var pokeID = 1

// rolls a pool of pokemon species that will be used
  for (let i = 0; i < flr; i++) {
    listLength = rawList.length
    pokeID = random(listLength)
    pokeroll.push(rawList[pokeID])
    rawList.splice(pokeID,1)
  }

// TRAITS SECTION ---------------------------
  // trait odds
  var common = 53
  var uncommon = 32
  var rare = 15
  // pulls trait lists from html file
  var commonPool = document.getElementById("common").innerHTML.split(", ").map(item => item.trim())
  var uncommonPool = document.getElementById("uncommon").innerHTML.split(", ").map(item => item.trim())
  var rarePool = document.getElementById("rare").innerHTML.split(", ").map(item => item.trim())
  var colorPool = ["Colored", "Shadow", "Melanistic", "Albino"]

  // Backup versions of the Pool arrays
  const commonBackup = [...commonPool]
  const uncommonBackup = [...uncommonPool]
  const rareBackup = [...rarePool]

// sets relevant odds to 0 depending on invite type
  if (invite == "common") {
    uncommon = 0;
    rare = 0;
  } else if (invite == "uncommon") {
    rare = 0
  }

// Trait Amount ---
var traitAmnt = 0
var num = random(100)

// Picks an amount between 0-3
  if (num >= 95) {
    traitAmnt = 3
  } else if (num >= 70) {
    traitAmnt = 2
  } else if (num >= 50) {
    traitAmnt = 1
  }
// Changes invalid trait amounts for Extreme Fusion invites
  if (invite == "fusionEX" && (traitAmnt > 2 || traitAmnt < 1)) {
    traitAmnt = 1
  }

// COLOR ----
// check back in later if isBasic has any use
num = random(100)
var color = "Basic"
var isShiny = false
var isBasic = true

if (num <= rare) {
  color = "Shiny"
  isShiny = true
  isBasic = false
} else if (num <= common) {
  color = colorPool[random(4)]
  isBasic = false
}

// OTHER TRAITS
var traitroll = []
var traitID = "0"
cr = common; ur = uncommon; rr = rare
var rar = rarity(cr,ur,rr) // returns a number corresponding to trait rarity
// 0 = COMMON; 1 = UNCOMMON; 2 = RARE

if (invite == "common" && traitAmnt > 0) {
  // trait-adding for loop
  for (let i = 0; i < traitAmnt; i++) {
    listLength = commonPool.length
    traitID = random(listLength)
    traitroll.push("+"+commonPool[traitID])
    commonPool.splice(traitID,1)
  }
  // UNCOMMON INVITES (FANCY)
} else if (invite == "uncommon") {
  // mandatory uncommon trait
  listLength = uncommonPool.length
  traitID = random(listLength)
  traitroll.push("+"+uncommonPool[traitID])
  uncommonPool.splice(traitID,1)
  // other traits
  if (traitAmnt > 1) {
    traitAmnt = traitAmnt-1 // removes mandatory from total before loop
    // trait-adding for loop
    for (let i = 0; i < traitAmnt; i++) {
      rar = rarity(cr,ur,rr)
      // if rar returns to "common"
      if (rar == 0) {
        listLength = commonPool.length
        traitID = random(listLength)
        traitroll.push("+"+commonPool[traitID])
        commonPool.splice(traitID,1)
      // if rar returns to "uncommon" or "rare" (since rare traits can't be rolled)
      } else {
        listLength = uncommonPool.length
        traitID = random(listLength)
        traitroll.push("+"+uncommonPool[traitID])
        uncommonPool.splice(traitID,1)
      }
    }
  }
} else if (invite == "rare" || invite == "fusionEX" || invite == "generic" || invite == "gamble") {
  // RARE INVITE SPECIFIC
  if (invite == "rare" && isShiny == false) {
      // mandatory rare trait
      listLength = rarePool.length
      traitID = random(listLength)
      traitroll.push("+"+rarePool[traitID])
      rarePool.splice(traitID,1)
      traitAmnt = traitAmnt-1 // removes mandatory from total before loop
    // EXTREME FUSION SPECIFIC
    } else if (invite == "fusionEX") {
      var index = uncommonPool.indexOf("Fusion")
      uncommonPool.splice(index,1)
      traitroll.push("+Fusion")
    }
    // other traits
    if (traitAmnt >= 1) {
      // trait-adding for loop
      for (let i = 0; i < traitAmnt; i++) {
        rar = rarity(cr,ur,rr)
        // if rar returns to "common"
        if (rar == 0) {
          listLength = commonPool.length
          traitID = random(listLength)
          traitroll.push("+"+commonPool[traitID])
          commonPool.splice(traitID,1)
        // if rar returns to "uncommon"
      } else if (rar == 1) {
          listLength = uncommonPool.length
          traitID = random(listLength)
          traitroll.push("+"+uncommonPool[traitID])
          uncommonPool.splice(traitID,1)
        } else {
          listLength = rarePool.length
          traitID = random(listLength)
          traitroll.push("+"+rarePool[traitID])
          rarePool.splice(traitID,1)
        }
      }
    }
  } else if (invite == "fusion") {
    traitroll.push("+Fusion")
    traitAmnt = 0
  }

  var traitline = traitroll.join("")

// FUSION STUFF
  var fusionAmnt = 0
  var pokespecies = []
  pokespecies.push(pokeroll[0])
  pokeroll.splice(0,1)

  if (traitline.includes("Fusion") == true) {
    // Rolls Fusion Amount (fusion-specific invites have higher odds of multi-fusion)
    if (invite == "fusionEX" || invite == "fusion") {
      fusionAmnt = rarity(70,20,10)+1
    } else {
      fusionAmnt = rarity(80,15,5)+1
    }
    // Adds pokémon together
    for (let i = 0; i < fusionAmnt; i++) {
      pokespecies.push(pokeroll[0])
      pokeroll.splice(0,1)
    }
  }

// DELTA STUFF
  var deltaPool = document.getElementById("types").innerHTML.split(", ").map(item => item.trim())
  const deltaBackup = [...deltaPool]
  var deltaAmnt = 0
  var deltaroll = []
  var deltaID = 0

  if (traitline.includes("Delta(TYPE)") == true) {
    // rolls delta amount
    num = random(100)
    if (num <= 5) {
      deltaAmnt = 4
    } else if (num <= 15) {
      deltaAmnt = 3
    } else if (num <= 35) {
      deltaAmnt = 2
    } else {
      deltaAmnt = 1
    }

    // delta for loop
    for (let i = 0; i < deltaAmnt; i++) {
      listLength = deltaPool.length
      deltaID = random(listLength)
      deltaroll.push(deltaPool[deltaID])
      deltaPool.splice(deltaID,1)
    }
    traitline = traitline.replace("(TYPE)", "("+deltaroll.join("+")+")")
  }

// Pushes to #results
  document.getElementById(divID).innerHTML = pokespecies.join("+") + "/" + color + traitline
}



// OTHER FUNCTIONS -------------------------------------------------------------

// random number (integer) generator
function random(max) {
  return Math.floor(Math.random() * max)
}

function rarity(common,uncommon,rare) {
  var num = random(common+uncommon+rare)
  var final = 0

  if (num <= rare) {
    final = 2
  } else if (num <= uncommon) {
    final = 1
  } else {
    final = 0
  }

  return final
}
