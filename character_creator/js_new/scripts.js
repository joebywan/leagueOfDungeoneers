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

  // Create the select (dropdown)
  const select_profession = document.createElement("select");
  select_profession.setAttribute("name", "profession_select");
  select_profession.setAttribute("id", "profession_select");
  select_profession.setAttribute("onchange", "professionSelected()");


  // Add the first blank option
  option_profession = document.createElement("option");
  option_profession.textContent = "Choose your profession:";
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
  container_professions.appendChild(select_profession);
});

// On page load set focus to first dropdown element
window.onload = function() {
  deselectRadios("attribute_assignment_strategy_radiogroup");
  deselectRadios("STR");
  deselectRadios("CON");
  deselectRadios("DEX");
  deselectRadios("WIS");
  deselectRadios("RES");
  deselectRadios("freeSkill");
  dgei("bstrVal").value = 0;
  dgei("bconVal").value = 0;
  dgei("bdexVal").value = 0;
  dgei("bwisVal").value = 0;
  dgei("bresVal").value = 0;
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
  dgei("finalHeader").hidden = false;   
  dgei("finalStats").hidden = false;
}

// ---------------------------------------
// Once the assignment strategy's been selected, move on
// ---------------------------------------
function attribute_assignment_strategy_selected() {
  dgei("attribute_assignment_strategy_header").style.backgroundColor="White";
  if (document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value === "as_rolled") {
    dgei("assign_attributes_table").hidden = true;
    dgei("str_or_1st").innerText = "STR";
    dgei("con_or_2nd").innerText = "CON";
    dgei("dex_or_3rd").innerText = "DEX";
    dgei("wis_or_4th").innerText = "WIS";
    dgei("res_or_5th").innerText = "RES";
    character_generated.rolled_attributes.str = character_generated.rolls.first;
    character_generated.rolled_attributes.con = character_generated.rolls.second;
    character_generated.rolled_attributes.dex = character_generated.rolls.third;
    character_generated.rolled_attributes.wis = character_generated.rolls.fourth;
    character_generated.rolled_attributes.res = character_generated.rolls.fifth;
  } else {
    dgei("str_or_1st").innerText = "1st";
    dgei("con_or_2nd").innerText = "2nd";
    dgei("dex_or_3rd").innerText = "3rd";
    dgei("wis_or_4th").innerText = "4th";
    dgei("res_or_5th").innerText = "5th";
    character_generated.rolled_attributes.str = 0;
    character_generated.rolled_attributes.con = 0;
    character_generated.rolled_attributes.dex = 0;
    character_generated.rolled_attributes.wis = 0;
    character_generated.rolled_attributes.res = 0;
  }

  if (dgei("roll_stats_table").hidden) {
    dgei("roll_stats_table").hidden = false;
  } else if (document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value === "assign" && character_generated.rerolls >= 2) {
    dgei("assign_attributes_table").hidden = false;
  }
  calcFinalValues();

}

// ---------------------------------------
// Roll the random stats
// Add the roll to the base
// Display the next area
// ---------------------------------------
function roll_stat(stat) {
  if (character_generated.rolls[stat] > 0) {
    character_generated.rerolls++
    if (character_generated.rerolls === 2) {
      for (let i of ["first","second","third","fourth","fifth","hp"]) {
        dgei("reroll_" + i).disabled = true;
        dgei("rerolls_label").style = "background-color:white;";
      }

    }
    dgei("reroll_" + stat).disabled = true;
  };

  let newroll = 0;
  if (stat === "hp") {
    for (let i = 1; i <= character_generated.race.hp_dice; i++) {
      newroll += getRandomNumber(1, character_data.config.hp_dice);
    };
  } else {
    newroll = getRandomNumber(1, character_data.config.attribute_dice);
  };

  if (newroll > character_generated.rolls[stat]) {
    character_generated.rolls[stat] = newroll;
  };
  for (let i of ["first","second","third","fourth","fifth","hp"]) { 
    dgei("rolled_display_" + i).innerText = character_generated.rolls[i];
  }
  if (document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value === "as_rolled") {
    for (const [attribute, rollKey] of [
      ['str', 'first'],
      ['con', 'second'],
      ['dex', 'third'],
      ['wis', 'fourth'],
      ['res', 'fifth']
    ]) {
      character_generated.rolled_attributes[attribute] = character_generated.rolls[rollKey];
    }
  }
  if (character_generated.rerolls === 2) {
    if (document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value === "as_rolled") {
      dgei("bonus_attributes").hidden = false;
      dgei("bonus_attributes").focus();
    } else {
      loadAttributeSelector();
      dgei("bonus_attributes").hidden = true;
    }
  }
  calcFinalValues();
}


function roll_stats() {
  // Disable the roll button and display the table for the next step
  dgei("roll_stats").innerText = "No more!";
  dgei("roll_stats").disabled = true;
  dgei("roll_stats_header").style.backgroundColor="White";

  // Roll the numbers
  for (let i of ["first","second","third","fourth","fifth","hp"]) { 
    roll_stat(i);
    dgei("rolled_display_" + i).innerText = character_generated.rolls[i];
  }

  // enable the reroll buttons
  dgei("rerolls_row_attributes").hidden = false;
  dgei("rerolls_row_hp").hidden = false;

  calcFinalValues();
}

// ---------------------------------------
// Attribute assignment area grouping all that together.
// ---------------------------------------

function loadAttributeSelector() {
  dgei("assign_attributes_table").hidden = false;
  for (let i of ["first","second","third","fourth","fifth"]) {
    dgei(i + "_roll_selector").innerText = character_generated.rolls[i]
  }
  dgei("assign_attributes_table").focus();
}
// clears rows when double selections are detected.
document.getElementById('assign_attributes_table').addEventListener('change', event => {
  if (event.target.classList.contains('attribute')) {
      const selectedRow = event.target.dataset.row;
      const attributeGroup = event.target.name;

      // Deselect other attributes in the same row
      document.querySelectorAll(`input[data-row="${selectedRow}"]`).forEach(otherRadio => {
          if (otherRadio.name !== attributeGroup) {
              otherRadio.checked = false;
          }
      });

      // Deselect other rows for the same attribute
      document.querySelectorAll(`input[name="${attributeGroup}"]`).forEach(otherRadio => {
          if (otherRadio.dataset.row !== selectedRow) {
              otherRadio.checked = false;
          }
      });
  }

  areFiveAttributesSelected()
});

// Detects when there's all 5 rows selected.  
function areFiveAttributesSelected() {
  const rows = [1, 2, 3, 4, 5]; // Row numbers to validate
  let allRowsSelected = true;

  rows.forEach(row => {
      // Check if any radio button in the current row is checked
      const isSelected = document.querySelector(`input[data-row="${row}"]:checked`);
      console.log("isSelected: " + isSelected);
      if (!isSelected || isSelected === null) {
          return
      }
  });

  // Enable or disable the "Proceed" button
  dgei("assign_attributes_header").style = "background-color:white;";
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
  if ( dgei(element.id).value > character_data.config.maxBonusPerStat) {
    dgei(element.id).value = character_data.config.maxBonusPerStat;
  }

 // Total all of the values.
  let totalPoints = 0;
  totalPoints = Number(dgei("bstrVal").value) + Number(dgei("bconVal").value) + Number(dgei("bdexVal").value) + Number(dgei("bwisVal").value) + Number(dgei("bresVal").value);

  character_generated.bonus_attributes.str = dgei("bstrVal").value;
  character_generated.bonus_attributes.con = dgei("bconVal").value;
  character_generated.bonus_attributes.dex = dgei("bdexVal").value;
  character_generated.bonus_attributes.wis = dgei("bwisVal").value;
  character_generated.bonus_attributes.res = dgei("bresVal").value;

  // If the total > 15 then calculate the highest allowed value for the last entry.
  if (totalPoints > character_data.config.maxBonusPoints) {
    totalPoints -= dgei(element.id).value;

    let calVal = 0;
    calVal = character_data.config.maxBonusPoints -  totalPoints;
     
    dgei(element.id).value = calVal;
    totalPoints = character_data.config.maxBonusPoints;

  }  // end of if totalPoints > 15

   // If 15 points have been entered move to next step
  if (totalPoints == character_data.config.maxBonusPoints) {
    dgei("profession").hidden = false;
  }

   // Need a visual indicator that all 15 ponits have not been allocated.
  if (totalPoints < character_data.config.maxBonusPoints) {
    dgei("bonusHeader").style.backgroundColor="Yellow";
  }

  if (totalPoints == character_data.config.maxBonusPoints) {
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
function professionSelected() {
  dgei("profession_select_header").style.backgroundColor="White";
  // Clear out the Free Skill radio buttons and ensure they are unselected
  deselectRadios("freeskill");

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

      dgei("freeSkill_label").style.backgroundColor = "Yellow";
  }
}

function professionBonusSelected() {

  dgei("freeSkill_label").style.backgroundColor="White";
  dgei("finalSkills").hidden = false;
  calcFinalValues();
}

// ---------------------------------------
// Calculate the final values based on the total points and bonuses.
// ---------------------------------------
function calcFinalValues() {
// alert ("calcFinalValues() called...");

  // clear the visual indicator on Select Free Skill
  if (dgei("freeSkill_label").style.backgroundColor === "Yellow") {
    dgei("freeSkill_label").style.backgroundColor="White";
  }
  

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
  let freeSkillSelected = document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked');
  if ((freeSkillSelected === undefined || freeSkillSelected === null)) {

  } else {
    let freeskillradio = document.querySelector('input[name="attribute_assignment_strategy_radiogroup"]:checked').value
    dgei("final"+ freeskillradio).innerHTML = Number(dgei("final" + freeskillradio).innerHTML) + 10
  }


// show final values
  window.scrollTo(0, document.body.scrollHeight);

}  // end of function calcFinalValues()

