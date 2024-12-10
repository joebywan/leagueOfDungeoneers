// ---------------------------------------
// Helper functions
// ---------------------------------------

//sick of typing it all out
function dgei(id) {
  if (document.getElementById(id)) {
    return document.getElementById(id);
  }
  return false
}

function dgen(name) {
  if (document.getElementsByName(name)) {
    return document.getElementsByName(name);
  }
  return false
}

function getRandomNumber(min, max) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function deselectRadios(radio_group_name) {
  let radios = dgen(radio_group_name);
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }
}

// ---------------------------------------
// Load stuff before the page loads proper
// ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {

  // ---------------------------------------
  // Create a dynamic dropdown for races
  // ---------------------------------------

  // Create the select (dropdown)
  const select_races = document.createElement("select");
  select_races.setAttribute("name", "race_select");
  select_races.setAttribute("id", "race_select");
  select_races.setAttribute("onchange", "race_selected()");

  // Add the first blank option
  option_races = document.createElement("option");
  option_races.textContent = "Choose your species";
  select_races.appendChild(option_races);

  // Get the races, suss out the length of each to find the longest
  for (const race in character_data.races) {
    const option_races = document.createElement("option");
    option_races.textContent = race;
    option_races.value = race
    select_races.appendChild(option_races);
  }

  // Set the div to be the objects we've just made instead.
  const container_races = dgei("dynamic_race_select");
  container_races.appendChild(select_races);

  // ---------------------------------------
  // Create a dynamic dropdown for professions
  // ---------------------------------------

  const label_profession = document.createElement("label");
  label_profession.setAttribute("for", "profession_select");
  label_profession.textContent = "4) Choose your profession:";
  label_profession.setAttribute("vertical-align", "top");

  // Create the select (dropdown)
  const select_profession = document.createElement("select");
  select_profession.setAttribute("name", "profession_select");
  select_profession.setAttribute("id", "profession_select");
  select_profession.setAttribute("onchange", "populateSkillMods()");


  // Add the first blank option
  option_profession = document.createElement("option");
  option_profession.textContent = "Choose me";
  select_profession.appendChild(option_profession);

  // Get the races, suss out the length of each to find the longest
  for (const profession in character_data.professions) {
    const option_profession = document.createElement("option");
    option_profession.setAttribute("value",  profession);
    option_profession.textContent = profession;
    select_profession.appendChild(option_profession);
  }

  // Set the div to be the objects we've just made instead.
  const container_professions = dgei("dynamic_profession_select");
  container_professions.appendChild(label_profession);
  container_professions.appendChild(select_profession);
});

// On page load set focus to first dropdown element
window.onload = function() {
  dgei("race_select").focus();
};


// ---------------------------------------
// Lookup the race from the dropdown
// Load the stats into the table
// ---------------------------------------
function race_selected() {
  dgei("race_select_header").style.backgroundColor="White";
  const race = dgei("race_select").value; //get the race from the dropdown and look it up.

  stats = character_data.races[race];
  if (!character_data.races[race]) { //If the race doesn't exist in config, load - instead.
    dgei("str_base").innerText = "-";
    dgei("con_base").innerText = "-";
    dgei("dex_base").innerText = "-";
    dgei("wis_base").innerText = "-";
    dgei("res_base").innerText = "-";
    dgei("hp_base").innerText = "-";
  } else { // load the found race stats into the table for user to see.
    character_generated.race = character_data.races[race]
    dgei("str_base").innerText = character_generated.race.str;
    dgei("con_base").innerText = character_generated.race.con;
    dgei("dex_base").innerText = character_generated.race.dex;
    dgei("wis_base").innerText = character_generated.race.wis;
    dgei("res_base").innerText = character_generated.race.res;
    dgei("hp_base").innerText = character_generated.race.hp;
  }

  if (dgei("attribute_assignment_strategy_table").hidden) {
    deselectRadios("attribute_assignment_strategy_radiogroup");
    dgei("attribute_assignment_strategy_table").hidden = false;
    dgei("attribute_assignment_strategy_table").focus();
  }

  calcFinalValues();
}

// ---------------------------------------
// Once the assignment strategy's been selected, move on
// ---------------------------------------
function attribute_assignment_strategy_selected() {
  dgei("attribute_assignment_strategy_header").style.backgroundColor="White";
  console.log("assignment strategy radiogroup: " + document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value);
  if (document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value === "as_rolled") {
    dgei("str_or_1st").innerText = "STR";
    dgei("con_or_2nd").innerText = "CON";
    dgei("dex_or_3rd").innerText = "DEX";
    dgei("wis_or_4th").innerText = "WIS";
    dgei("res_or_5th").innerText = "RES";
  } else {
    dgei("str_or_1st").innerText = "1st";
    dgei("con_or_2nd").innerText = "2nd";
    dgei("dex_or_3rd").innerText = "3rd";
    dgei("wis_or_4th").innerText = "4th";
    dgei("res_or_5th").innerText = "5th";
  }

  dgei("roll_stats_table").hidden = false;
}

// ---------------------------------------
// Roll the random stats
// Add the roll to the base
// Display the next area
// ---------------------------------------
function roll_stats() {
  // Disable the roll button and display the table for the next step
  dgei("roll_stats").innerText = "No Rerolls!";
  dgei("roll_stats").disabled = true;
  dgei("roll_stats_header").style.backgroundColor="White";

  // Roll the numbers
  character_generated.rolls.first = getRandomNumber(1, 10);
  character_generated.rolls.second = getRandomNumber(1, 10);
  character_generated.rolls.third = getRandomNumber(1, 10);
  character_generated.rolls.fourth = getRandomNumber(1, 10);
  character_generated.rolls.fifth = getRandomNumber(1, 10);

  dgei("1_rolled").innerText = character_generated.rolls.first;
  dgei("2_rolled").innerText = character_generated.rolls.second;
  dgei("3_rolled").innerText = character_generated.rolls.third;
  dgei("4_rolled").innerText = character_generated.rolls.fourth;
  dgei("5_rolled").innerText = character_generated.rolls.fifth;

  // fucking half-ogres and their 2d6
  const race = dgei("race_select").value;
  for (let i = 1; i <= character_generated.race.hp_dice; i++) {
    character_generated.rolls.hp += getRandomNumber(1, 6);
  }
  dgei("hp_rolled").innerText = character_generated.rolls.hp;

  dgei("str_total").innerText = Number(dgei("str_base").innerText) + Number(dgei("str_rolled").innerText);
  dgei("con_total").innerText = Number(dgei("con_base").innerText) + Number(dgei("con_rolled").innerText);
  dgei("dex_total").innerText = Number(dgei("dex_base").innerText) + Number(dgei("dex_rolled").innerText);
  dgei("wis_total").innerText = Number(dgei("wis_base").innerText) + Number(dgei("wis_rolled").innerText);
  dgei("res_total").innerText = Number(dgei("res_base").innerText) + Number(dgei("res_rolled").innerText);
  dgei("hp_total").innerText = Number(dgei("hp_base").innerText) + Number(dgei("hp_rolled").innerText);
  dgei("bonus_attributes").hidden = false;
  dgei("bonus_attributes").focus();
}



// ---------------------------------------
// Manage the input of values
// Once the max is hit then display the next area
// Trigger recalc, and if the end is already shown, trigger recalc on each change
// ---------------------------------------
function checkBonus(element) {

// Do not allow the input of negative values.
  if ( dgei(element.id).value < 0) {
    dgei(element.id).value = Math.abs( dgei(element.id).value);
  }

// if input value > 10, then set it to a value of 10 (max allowed) (10 default)
  if ( dgei(element.id).value > character_data.bonuses.maxBonusPerStat) {
    dgei(element.id).value = character_data.bonuses.maxBonusPerStat;
  }

 // Total all of the values.
  let totalPoints = 0;
  totalPoints = Number(dgei("bstrVal").value) + Number(dgei("bconVal").value) + Number(dgei("bdexVal").value) + Number(dgei("bwisVal").value) + Number(dgei("bresVal").value);

  // If the total > 15 then calculate the highest allowed value for the last entry.
  if (totalPoints > character_data.bonuses.maxBonusPoints) {
    totalPoints -= dgei(element.id).value;

    let calVal = 0;
    calVal = character_data.bonuses.maxBonusPoints -  totalPoints;
     
    dgei(element.id).value = calVal;
    totalPoints = character_data.bonuses.maxBonusPoints;

  }  // end of if totalPoints > 15

   // If 15 points have been entered move to next step
  if (totalPoints == character_data.bonuses.maxBonusPoints) {
    dgei("profession").hidden = false;
  }


   // Need a visual indicator that all 15 ponits have not been allocated.
  if (totalPoints < character_data.bonuses.maxBonusPoints) {
    dgei("bonusHeader").style.backgroundColor="Yellow";
  }

  if (totalPoints == character_data.bonuses.maxBonusPoints) {
    dgei("profession").hidden = false;

    dgei("profession").focus();
    dgei("bonusHeader").style.backgroundColor="White";
  }

  // Recalculate if the user changes bonus points after totals are displayed.  
  if (dgei("finalHeader").hidden == false) {
    calcFinalValues();
  }  // end of if statement
}  // end of function checkBonus()


// ---------------------------------------
// Take the profession from the dropdown
// Load the modifiers from ./js/data.js
// Enable only the radio buttons under the negative modifiers.
// ---------------------------------------
function populateSkillMods() {
  // Clear out the Free Skill radio buttons and ensure they are unselected
  let radios = dgen("freeSkill");
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }

  // Get the selected profession
  const profession = dgei("profession_select").value;

  // Access the professions data from data.js
  const professions = character_data.professions;

  // Check if the selected profession exists
  if (professions.hasOwnProperty(profession)) {
    const modData = professions[profession];

    // Iterate through the modifiers
    for (const [key, value] of Object.entries(modData)) {
      displayElement = dgei(key + "_mod");

      if (displayElement) {
        displayElement.innerHTML = value;
        if (parseInt(value) < 0) {
          document.getElementById(key + "_radio").style.display = "";
        }
      }
    }

      dgei("freeSkill").style.backgroundColor = "Yellow";
  }
}

// ---------------------------------------
// Calculate the final values based on the total points and bonuses.
// ---------------------------------------
function calcFinalValues() {
// alert ("calcFinalValues() called...");

  // clear the visual indicator on Select Free Skill
  dgei("freeSkill").style.backgroundColor="White";

  // Sum the values from the subtotal + allocated bonus points + User entered extra points
  dgei("finalSTR").innerHTML = Number(character_generated.race.str) + Number(character_generated.rolled_attributes.str) + Number(character_generated.bonus_attributes.str);
  dgei("finalCON").innerHTML = Number(character_generated.race.con) + Number(character_generated.rolled_attributes.con) + Number(character_generated.bonus_attributes.con);
  dgei("finalDEX").innerHTML = Number(character_generated.race.dex) + Number(character_generated.rolled_attributes.dex) + Number(character_generated.bonus_attributes.dex);
  dgei("finalWIS").innerHTML = Number(character_generated.race.wis) + Number(character_generated.rolled_attributes.wis) + Number(character_generated.bonus_attributes.wis);
  dgei("finalRES").innerHTML = Number(character_generated.race.res) + Number(character_generated.rolled_attributes.res) + Number(character_generated.bonus_attributes.res);
  dgei("finalHP").innerHTML =  Number(character_generated.race.hp) + Number(character_generated.rolls.hp) + Number(character_generated.profession.bonus_hp);

  // Calculte final values for Skills as STAT + Profession Modifier + Free Skill if applicable
  dgei("finalCS").innerHTML = Number(dgei("finalDEX").innerHTML) + Number(dgei("cs_mod").innerHTML) ;
  dgei("finalRS").innerHTML = Number(dgei("finalDEX").innerHTML) + Number(dgei("rs_mod").innerHTML);
  dgei("finalDodge").innerHTML = Number(dgei("finalDEX").innerHTML) + Number(dgei("dodge_mod").innerHTML);
  dgei("finalLocks").innerHTML = Number(dgei("finalDEX").innerHTML) + Number(dgei("picklocks_mod").innerHTML);

  dgei("finalBarter").innerHTML = Number(dgei("finalWIS").innerHTML) + Number(dgei("barter_mod").innerHTML);
  dgei("finalHeal").innerHTML = Number(dgei("finalWIS").innerHTML) + Number(dgei("heal_mod").innerHTML);
  dgei("finalAlchemy").innerHTML = Number(dgei("finalWIS").innerHTML) + Number(dgei("alchemy_mod").innerHTML);
  dgei("finalPerception").innerHTML = Number(dgei("finalWIS").innerHTML) + Number(dgei("perception_mod").innerHTML);


  // Special case Arcane Arts because it is not available to all professions
  if (dgei("arcane_mod").innerHTML == "NA" ) {
    dgei("finalArcane").innerHTML = "NA";
  }  
  else
  {
    dgei("finalArcane").innerHTML = Number(dgei("finalWIS").innerHTML) + Number(dgei("arcane_mod").innerHTML);
  }

  dgei("finalForage").innerHTML = Number(dgei("finalCON").innerHTML) + Number(dgei("forage_mod").innerHTML);
   
  // Special case Battle Prayers because it is not available to all professions
  if (dgei("prayer_mod").innerHTML == "NA" ) {
    dgei("finalPrayer").innerHTML = "NA";
  } else {
    dgei("finalPrayer").innerHTML = Number(dgei("finalRES").innerHTML) + Number(dgei("prayer_mod").innerHTML);
  }

  // check the selected Free Skill and add +10 to the appropriate skill
  if ((typeof checkFreeSkill() === "undefined")) {

  } else {
    let freeskillradio = document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value
    dgei("final"+ freeskillradio).innerHTML = Number(dgei("final" + freeskillradio).innerHTML) + 10
  }


// show final values
  dgei("finalHeader").hidden = false;   
  dgei("finalStats").hidden = false;
  dgei("finalSkills").hidden = false;
  window.scrollTo(0, document.body.scrollHeight);

}  // end of function calcFinalValues()

function checkFreeSkill() {
//alert("checkFreeSkill() called...");

  var radioButtonGroup = document.getElementsByName("freeSkill");
  var checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);

    return checkedRadio;

}  // end of function checkFreeSkill()
