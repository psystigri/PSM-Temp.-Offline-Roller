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
  if (invite == "fusionEX" && traitAmnt > 1) {
    traitAmnt = traitAmnt-1
  } else if (invite == "fusionEX" && traitAmnt < 1) {
    traitAmnt = 1
  }

// COLOR ----
// check back in later if isBasic has any use
num = random(100)
var color = "Basic"
var isShiny = false
var isBasic = true

if (num < rare) {
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

// Pushes to given results (div) line; also adds shiny sparkle (&#x2728;)
// view decimal codes for emojis > https://www.quackit.com/character_sets/emoji/emoji_v3.0/unicode_emoji_v3.0_characters_all.cfm
if (isShiny == true) {
  document.getElementById(divID).innerHTML = pokespecies.join("+") + "/" + color + traitline + "&#x2728;"
} else {
  document.getElementById(divID).innerHTML = pokespecies.join("+") + "/" + color + traitline
}

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

function listFixer(list, exceptions, keepers) {
  // Turns exceptions & keepers list into arrays
  const exceptionsList = exceptions.split(",").map(item => item.trim())
  const keepersList = keepers.split(",").map(item => item.trim())

  var output = []

  for (const item of list) {
    // Removes empty items
    if (item.trim() == "") {
      continue
    }

    // Removes all items on exceptions lists
    if (exceptionsList.includes(item)) {
      continue
    // Preserves all instances on keepers lists
    } else if (keepersList.includes(item)) {
      output.push(item)
      continue
    // Removes duplicates
    } else if (!output.includes(item)) {
      output.push(item);
    }
  }

  return output;
}

function extractFromList (input, trait) {
  // trait = "Delta" or "Chimera"
  const regex = new RegExp(trait + "\\(([^)]+)\\)");
  const match = input.match(regex)

  return match ? match[1] : false
}

function replaceFromList (input, trait) {
  // trait = "Delta" or "Chimera"
  const regex = new RegExp(trait + "\\(([^)]+)\\)");

  return input.replace(regex,trait)
}


// LISTPICKER SCRIPTS -------------------------------------------------------------
function pickFromList(divID) {
  var rawList = document.getElementById("listArea").value.split("\n").map(item => item.trim())
  var amnt = document.getElementById("rollAmnt").value
  var pay = document.getElementById("payInput").value
  var output = []

  // Clamps pay to 100-2000 range
  if (pay < 100 || pay == undefined) {
    pay = 100
  } else if (pay > 2000) {
    pay = 2000
  }

  // Payment percentage
  var percent = ((pay-100)/1900).toFixed(2)
  // Calculates odds
  var one = ((15*(1-percent))+5)*10
  var two = ((4*(1-percent))+6)*10
  var three = ((5*percent)+3)*10
  var four = ((10*percent)+1)*10

  var total = one+two+three+four // total odds value
  var combined = [one,two,three,four] // array of combined odds

  // random value between 0 and full odds
  var ran = random(total)

  var cumulative = 0;

  // Checks which amount 'ran' falls under
  if (amnt == 0) {
    for (let i = 0; i < combined.length; i++) {
      // adds the value of the current odd "level", in order to check which level 'cumulative' is currently at
      cumulative += combined[i];

      // if ran is lower than the current cumulative value, that means that "i" is at the correct level / amnt
      if (ran < cumulative) {
        amnt = i + 1;
        break;
      }
    }
  }

  // Adds appropriate amount of items to 'output'

  var listLength = rawList.length

  for (let i = 0; i < amnt; i++) {
    ran = random(listLength)
    output.push(rawList[ran])
  }

  // writes to #results
  document.getElementById(divID).innerHTML = output.join("<div class='split'></div>")
}


// BREEDING SCRIPTS -------------------------------------------------------------
function breed(divID) {
  var sire = document.getElementById("sire").value
  var dam = document.getElementById("dam").value

  // Extracts Delta & Chimera values if any
  var deltaTypePool = []
  if (sire.includes("Delta") == true) {
    deltaTypePool.push(...extractFromList(sire, "Delta").split("+"))
  }
  if (dam.includes("Delta") == true) {
    deltaTypePool.push(...extractFromList(dam, "Delta").split("+"))
  }
  // True/false statement to check if delta is present in parents
  if (dam.includes("Delta") == true || sire.includes("Delta") == true) {
    var hasDelta = true
  } else {var hasDelta = false}

// Slice here removes the color trait(s) since all are pushed to the same array.
  var chimTraitPool = []
  if (sire.includes("Chimera") == true) {
    chimTraitPool.push(
      ...extractFromList(sire, "Chimera")
      .split("+")
      .filter(x => !x.startsWith("Delta("))
      .filter(x => x !== "").slice(1))
  }
  if (dam.includes("Chimera") == true) {
    chimTraitPool.push(
      ...extractFromList(dam, "Chimera")
      .split("+")
      .filter(x => !x.startsWith("Delta("))
      .filter(x => x !== "").slice(1))
  }
  // True/false statement to check if chimera is present in parents
  if (dam.includes("Chimera") == true || sire.includes("Chimera") == true) {
    var hasChim = true
  } else {var hasChim = false}

  // Removes Delta & Chimera parentheses from geno, if any
  var sirePre = replaceFromList(sire, "Delta")
  var damPre = replaceFromList(dam, "Delta")
  sirePre = replaceFromList(sirePre, "Chimera")
  damPre = replaceFromList(damPre, "Chimera")

  // splits species and traits
  const sireSpecies = (sirePre.split("/"))[0].split("+")
  const damSpecies = (damPre.split("/"))[0].split("+")

  var sireTraitsRaw = (sirePre.split("/"))[1].split("+")
  var damTraitsRaw = (damPre.split("/"))[1].split("+")

  // Creates a raw species pool, and a species pool without duplicates
  var speciesPoolRaw = [...sireSpecies, ...damSpecies]
  var speciesPool = listFixer(speciesPoolRaw,"Ditto","Eevee,Lepiva")

  // Combined species amount + parents' species amount
  var maxSpecies = 1
  if (speciesPool.length >= 4) {
    maxSpecies = 4
  } else {
    maxSpecies = speciesPool.length
  }
  var sireSpeciesAmnt = sireSpecies.length
  var damSpeciesAmnt = damSpecies.length

  // Separates color trait
  var sireColor = sireTraitsRaw[0]
  var damColor = damTraitsRaw[0]
  // removes color trait from raw list
  sireTraitsRaw.splice(0,1)
  damTraitsRaw.splice(0,1)

  // removes duplicate traits from individual parent lists
  var sireTraits = listFixer(sireTraitsRaw,"Fusion,Birthday Bash,Chimera","")
  var damTraits = listFixer(damTraitsRaw,"Fusion,Birthday Bash,Chimera","")

  // counts amount of traits each parent has
  var sireTraitAmnt = sireTraits.length
  var damTraitAmnt = damTraits.length

  // Creates a raw trait pool, and a trait pool without duplicates
  var traitPoolRaw = [...sireTraits, ...damTraits]
  var traitPool = listFixer(traitPoolRaw,"","")
  var maxTraitsRaw = traitPool.length

  // defines childAmnt
  var childAmnt = 1
  var ovalCharm = document.getElementById("ovalCharm").checked

  var ran = random(100)
  if (ran <= 10) {
    childAmnt = 6
  } else if (ran <= 25) {
    childAmnt = 5
  } else if (ran <= 55) {
    childAmnt = 4
  } else if (ran <= 80) {
    childAmnt = 3
  } else if (ran <= 95) {
    childAmnt = 2
  } else {
    childAmnt = 1
  }

  if (ovalCharm == true) {
    childAmnt = childAmnt*2
  }

  var baseSpeciesAmnt = 1
  if (sireSpeciesAmnt <= damSpeciesAmnt) {
    baseSpeciesAmnt = sireSpeciesAmnt
  } else {
    baseSpeciesAmnt = damSpeciesAmnt
  }

  var children = []
  // for loop that makes it so you get as many children as you rolled #yup
  for (let i = 0; i < childAmnt; i++) {
    var listLength = 1
    var childID = 0

    // SPECIES START
    // Still need to add Ditto functionality if desired
    var childSpeciesAmnt = 1
    var childSpecies = []
    var childSpeciesPool = [...speciesPool]

    ran = random(100)
    if (ran < 15) {
      childSpeciesAmnt = sireSpeciesAmnt
    } else if (ran < 30) {
      childSpeciesAmnt = damSpeciesAmnt
    } else if (ran < 70) {
      childSpeciesAmnt = random(maxSpecies - baseSpeciesAmnt + 1) + baseSpeciesAmnt
    } else if (ran < 85 && maxSpecies >= 2) {
      childSpeciesAmnt = 2
    } else {
      childSpeciesAmnt = 1
    }

    if (childSpeciesAmnt > maxSpecies) {
      childSpeciesAmnt = maxSpecies
    }

    ran = random(100)
    if (speciesPool.length == 0 || (speciesPoolRaw.includes("Ditto") && ran < 2)) {
      // Defaults to Ditto if there are no inheritable species
      childSpecies.push("Ditto")
      childSpeciesAmnt = 0
    } else if (speciesPoolRaw.includes("Ditto") && childSpeciesAmnt < 4 && ran < 5) {
      childSpecies.push("Ditto")
    }

    for (let i = 0; i < childSpeciesAmnt; i++) {
      listLength = childSpeciesPool.length
      childID = random(listLength)
      childSpecies.push(childSpeciesPool[childID])
      childSpeciesPool.splice(childID,1)
    }

    // SPECIES OVER

    // COLOR START
    var childTraitPool = [...traitPoolRaw]
    var childTraits = []
    var childTraitAmnt = 0
    var maxTraits = maxTraitsRaw
    var maxTraitsChim = 0

    // allows traits contained in chimera to rarely pass down (30%)
    ran = random (100)
    if (hasChim == true && chimTraitPool.length > 0 && ran < 30) {
      childTraitPool.push(...chimTraitPool)
      // edits maxTraits value to be slightly higher if chimera traits are added to the pool
      maxTraitsChim = listFixer(childTraitPool,"","").length
      // if child has at least 3 unique traits in pool, maxTraits will remain close to its original value (parents' trait amounts w/o chimera)
      if (maxTraitsChim >= 3) {
        // if the impact of chimera traits on trait amount is significant (more than 40% of total traits), maxTraits is clamped to natural value + 1
        if (chimTraitPool.length / childTraitPool.length >= 0.4 && maxTraitsChim > maxTraits) {
          maxTraits = maxTraits + 1
        } else {
          maxTraits = maxTraitsChim - Math.round(chimTraitPool.length / 2)
        }
      } else {
        maxTraits = maxTraitsChim
      }
    }

    // Determines child's amount of traits
    ran = random(100)
    if (ran < 21) {
      childTraitAmnt = random(maxTraits - sireTraitAmnt + 1) + sireTraitAmnt
    } else if (ran < 42){
      childTraitAmnt = random(maxTraits - damTraitAmnt + 1) + damTraitAmnt
    } else if (ran < 63) {
      childTraitAmnt = sireTraitAmnt
    } else if (ran < 85) {
      childTraitAmnt = damTraitAmnt
    } else {
      ran = random(100)
      if (ran > 85 && maxTraits >= 2) {
        childTraitAmnt = 2
      } else if (ran > 60 && maxTraits >= 1) {
        childTraitAmnt = 1
      } else {
        childTraitAmnt = 0
      }
    }

    if (childTraitAmnt > maxTraits) {
      childTraitAmnt = maxTraits
    }

    // Determines child's color trait
    ran = random(100)
    if (ran < 40) {
      childTraits.push(sireColor)
    } else if (ran < 80) {
      childTraits.push(damColor)
    } else if (ran < 98){
      childTraits.push("Basic")
    } else {
      childTraits.push("Shiny")
    }

    ran = random(100)
    if (childSpecies.length > 1) {
      childTraits.push("Fusion")
      if (ran < 50 && childTraitAmnt >= 1) {
        childTraitAmnt = childTraitAmnt - 1
      }
    }

    for (let i = 0; i < childTraitAmnt; i++) {
      listLength = childTraitPool.length
      childID = random(listLength)
      childTraits.push(childTraitPool[childID])
      childTraitPool.splice(childID,1)
    }
    // TRAITS END

    childTraits = listFixer(childTraits,"","")

    // ADD DELTA TYPES
    var childDeltaPool = [...deltaTypePool]
    var maxDelta = listFixer(childDeltaPool,"","").length
    var childDelta = []
    var deltaAmnt = 0

    // determines amount of child delta types
    if (childTraits.includes("Delta") == true) {
      ran = random(100)
      if (ran > 90 && maxDelta >= 4) {
        deltaAmnt = 4
      } else if (ran > 75 && maxDelta >= 3) {
        deltaAmnt = 3
      } else if (ran > 40 && maxDelta >= 2) {
        deltaAmnt = 2
      } else {
        deltaAmnt = 1
      }
    }

    // Determines child's delta types
    for (let i = 0; i < deltaAmnt; i++) {
      listLength = childDeltaPool.length
      childID = random(listLength)
      childDelta.push(childDeltaPool[childID])
      childDeltaPool.splice(childID,1)
    }
    // removes duplicates if any
    childDelta = listFixer(childDelta,"","")

    var index = childTraits.indexOf("Delta")
    if (index !== -1) {
      childTraits.splice(index,1,"Delta("+childDelta.join("+")+")")
    }


    var includeEgg = document.getElementById("includeEgg").checked

    if (includeEgg == true) {
    // if (EGG) is checked
      if (childTraits.includes("Shiny")) {
        children.push("**(EGG)** "+childSpecies.join("+")+"/"+childTraits.join("+")+"&#x2728;")
      } else {
        children.push("**(EGG)** "+childSpecies.join("+")+"/"+childTraits.join("+"))
      }
    // if (EGG) isn't checked
    } else {
      if (childTraits.includes("Shiny")) {
        children.push(childSpecies.join("+")+"/"+childTraits.join("+")+"&#x2728;")
      } else {
        children.push(childSpecies.join("+")+"/"+childTraits.join("+"))
      }
    }
  }

  // writes to #results
  document.getElementById(divID).innerHTML = children.join("<div class='split'></div>")
}
