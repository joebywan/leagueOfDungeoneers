//sick of typing it all out
function dge(id) {
  if (document.getElementById(id)) {
    return document.getElementById(id);
  }
  return false
}

// On page load set focus to first dropdown element
window.onload = function() {
  dge("race_select").focus();
};

// Stuff to do prior to page load
document.addEventListener("DOMContentLoaded", function () {

  // ---------------------------------------
  //Create a dynamic dropdown for races
  // ---------------------------------------

  // Create the label
  const label = document.createElement("label");
  label.setAttribute("for", "race_select");
  label.textContent = "1) Choose your species:";
  label.setAttribute("vertical-align", "top");

  // Create the select (dropdown)
  const select_races = document.createElement("select");
  select_races.setAttribute("name", "race_select");
  select_races.setAttribute("id", "race_select");
  select_races.setAttribute("onchange", "base_attribute_load()");
  select_races.setAttribute("size", Object.keys(character_data.races).length); // Set the size of the dropdown as the size of the list

  // needed for width of the dropdown (gotta suss out if there's some auto method instead)
  let longestOption = 0;

  // Get the races, suss out the length of each to find the longest
  for (const race in character_data.races) {
    const option_races = document.createElement("option");
    option_races.setAttribute("value",  race);
    option_races.textContent = race;
    select_races.appendChild(option_races);


    if (race.length > longestOption) {
      longestOption = race.length;
    }
  }

  // Set width dynamically (average character width is ~8px)
  select_races.style.width = `${longestOption * 8 + 20}px`; // Adjust as needed for padding

  // Set the div to be the objects we've just made instead.
  const container_races = dge("dynamic_race_select");
  container_races.appendChild(label);
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
  //select_profession.setAttribute("size", Object.keys(character_data.professions).length); // Set the size of the dropdown as the size of the list

  // needed for width of the dropdown (gotta suss out if there's some auto method instead)
  longestOption = 0;

  // Get the races, suss out the length of each to find the longest
  for (const profession in character_data.professions) {
    const option_profession = document.createElement("option");
    option_profession.setAttribute("value",  profession);
    option_profession.textContent = profession;
    select_profession.appendChild(option_profession);


    if (profession.length > longestOption) {
      longestOption = profession.length;
    }
  }

  // Set width dynamically (average character width is ~8px)
  //select_profession.style.width = `${longestOption * 8 + 20}px`; // Adjust as needed for padding

  // Set the div to be the objects we've just made instead.
  const container_professions = dge("dynamic_profession_select");
  container_professions.appendChild(label_profession);
  container_professions.appendChild(select_profession);
});

function base_attribute_load() {
  const race = dge("race_select").value;
  stats = character_data.races[race];
  if (!character_data.races[race]) {
    dge("str_base").innerText = "-";
    dge("con_base").innerText = "-";
    dge("dex_base").innerText = "-";
    dge("wis_base").innerText = "-";
    dge("res_base").innerText = "-";
    dge("hp_base").innerText = "-";
  } else {
    dge("str_base").innerText = stats.str;
    dge("con_base").innerText = stats.con;
    dge("dex_base").innerText = stats.dex;
    dge("wis_base").innerText = stats.wis;
    dge("res_base").innerText = stats.res;
    dge("hp_base").innerText = stats.hp;
  }

  // Recalculate summary of base stats if the selected species is changed
  if (!dge("bonus_attributes").hidden) {
    generateTotals();
    calcFinalValues();
  } else {
    dge("roll_stats").hidden = false;
    dge("roll_stats").focus();
  }
}

function roll_stats() {
  dge("str_rolled").innerText = getRandomNumber(1, 10);
  dge("con_rolled").innerText = getRandomNumber(1, 10);
  dge("dex_rolled").innerText = getRandomNumber(1, 10);
  dge("wis_rolled").innerText = getRandomNumber(1, 10);
  dge("res_rolled").innerText = getRandomNumber(1, 10);

  // fucking half-ogres and their 2d6
  const race = dge("race_select").value;
  stats = character_data.races[race];
  hp_total = 0
  for (let i = 1; i <= stats.hp_dice; i++) {
    hp_total += getRandomNumber(1, 6);
  }
  
  dge("hp_rolled").innerText = hp_total;

  // Disable the roll button and display the table for the next step
  dge("roll_stats").disabled = true;

  dge("str_total").innerText = Number(dge("str_base").innerText) + Number(dge("str_rolled").innerText);
  dge("con_total").innerText = Number(dge("con_base").innerText) + Number(dge("con_rolled").innerText);
  dge("dex_total").innerText = Number(dge("dex_base").innerText) + Number(dge("dex_rolled").innerText);
  dge("wis_total").innerText = Number(dge("wis_base").innerText) + Number(dge("wis_rolled").innerText);
  dge("res_total").innerText = Number(dge("res_base").innerText) + Number(dge("res_rolled").innerText);
  dge("hp_total").innerText = Number(dge("hp_base").innerText) + Number(dge("hp_rolled").innerText);
  console.log("hp_total: " + dge("hp_total").innerText);
  dge("bonus_attributes").hidden = false;
  dge("bonus_attributes").focus();
}

function getRandomNumber(min, max) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function for processing 15 Bonus Point assignment
function checkBonus(element) {

// Do not allow the input of negative values.
  if ( dge(element.id).value < 0) {
    dge(element.id).value = Math.abs( dge(element.id).value);
  }

// if input value > 10, then set it to a value of 10 (max allowed)
  if ( dge(element.id).value > 10) {
    dge(element.id).value = 10;
  }

 // Total all of the values.
  let totalPoints = 0;
  totalPoints = Number(dge("bstrVal").value) + Number(dge("bconVal").value) + Number(dge("bdexVal").value) + Number(dge("bwisVal").value) + Number(dge("bresVal").value);

  // If the total > 15 then calculate the highest allowed value for the last entry.
  if (totalPoints > 15) {
    totalPoints -= dge(element.id).value;

    let calVal = 0;
    calVal = 15 -  totalPoints;
     
    dge(element.id).value = calVal;
    totalPoints = 15;

  }  // end of if totalPoints > 15

   // If 15 points have been entered move to next step
  if (totalPoints == 15) {
    dge("profession").hidden = false;
  }


   // Need a visual indicator that all 15 ponits have not been allocated.
  if (totalPoints < 15) {
    dge("bonusHeader").style.backgroundColor="Yellow";
  }

  if (totalPoints == 15) {
    dge("profession").hidden = false;

    dge("profession").focus();
    dge("bonusHeader").style.backgroundColor="White";

  // Recalculate if the user changes bonus points after totals are displayed.  
    if (dge("finalHeader").hidden == false) {
      generateTotals();
      calcFinalValues();
    }  // end of if statement
  }
}  // end of function checkBonus()

function populateSkillMods() {
  // Clear out the Free Skill radio buttons and ensure they are unselected
  clearFreeSkill();

  // Get the selected profession
  const profession = dge("profession_select").value;

  // Access the professions data from data.js
  const professions = character_data.professions;

  // Check if the selected profession exists
  if (professions.hasOwnProperty(profession)) {
    const modData = professions[profession];

    // Iterate through the modifiers
    for (const [key, value] of Object.entries(modData)) {
      displayElement = dge(key + "_mod");

      if (displayElement) {
        displayElement.innerHTML = value;
        if (parseInt(value) < 0) {
          document.getElementById(key + "_radio").style.display = "";
        }
      }
    }

  // Highlight the free skill selection area if no skill is chosen
    if (typeof checkFreeSkill() === "undefined") {
      dge("freeSkill").style.backgroundColor = "Yellow";
    } else {
      dge("freeSkill").style.backgroundColor = "White";
    }
  }
}

// Helper to toggle free skill buttons based on profession
function toggleFreeSkillButtons(mods) {
    const skillButtons = document.getElementsByName("freeSkill");
    skillButtons.forEach((button) => {
        const skillName = button.id.toLowerCase();
        button.style.display = mods[skillName] !== undefined ? "" : "none";
    });
}

function clearFreeSkill() {
// alert ("clearFreeSkill() called");

    // Loop through all of the radio elements to uncheck and hide them.

    // Get all of the radio buttons as an Array 
   var radioButtonGroup = document.getElementsByName('freeSkill');

   var RadioArray = Array.from(radioButtonGroup);

   for (let i = 0; i < RadioArray.length;  i++) {
    RadioArray[i].style.display = 'none';
    RadioArray[i].checked = false;
    }

}  // end of function clearFreeSkill()

function calcFinalValues() {
// alert ("calcFinalValues() called...");

   // clear the visual indicator on Select Free Skill
  dge("freeSkill").style.backgroundColor="White";

  // Sum the values from the subtotal + allocated bonus points + User entered extra points
  dge("finalSTR").innerHTML = Number(dge('str_total').innerHTML) + Number(dge('bstrVal').value);
  dge("finalCON").innerHTML = Number(dge('con_total').innerHTML) + Number(dge('bconVal').value);
  dge("finalDEX").innerHTML = Number(dge('dex_total').innerHTML) + Number(dge('bdexVal').value);
  dge("finalWIS").innerHTML = Number(dge('wis_total').innerHTML) + Number(dge('bwisVal').value);
  dge("finalRES").innerHTML = Number(dge('res_total').innerHTML) + Number(dge('bresVal').value);
  dge("finalHP").innerHTML =  Number(dge('hp_total').innerHTML) + Number(dge('bonus_hp_mod').innerHTML);
   // Calculte final values for Skills as STAT + Profession Modifier + Free Skill if applicable
  dge("finalCS").innerHTML = Number(dge("finalDEX").innerHTML) + Number(dge("cs_mod").innerHTML) ;
  dge("finalRS").innerHTML = Number(dge("finalDEX").innerHTML) + Number(dge("rs_mod").innerHTML);
  dge("finalDodge").innerHTML = Number(dge("finalDEX").innerHTML) + Number(dge("dodge_mod").innerHTML);
  dge("finalLocks").innerHTML = Number(dge("finalDEX").innerHTML) + Number(dge("picklocks_mod").innerHTML);

  dge("finalBarter").innerHTML = Number(dge("finalWIS").innerHTML) + Number(dge("barter_mod").innerHTML);
  dge("finalHeal").innerHTML = Number(dge("finalWIS").innerHTML) + Number(dge("heal_mod").innerHTML);
  dge("finalAlchemy").innerHTML = Number(dge("finalWIS").innerHTML) + Number(dge("alchemy_mod").innerHTML);
  dge("finalPerception").innerHTML = Number(dge("finalWIS").innerHTML) + Number(dge("perception_mod").innerHTML);


  // Special case Arcane Arts because it is not available to all professions
   if (dge("arcane_mod").innerHTML == "NA" ) {
      dge("finalArcane").innerHTML = "NA";
   }  
   else
   {
      dge("finalArcane").innerHTML = Number(dge("finalWIS").innerHTML) + Number(dge("arcane_mod").innerHTML);
   }

   dge("finalForage").innerHTML = Number(dge("finalCON").innerHTML) + Number(dge("forage_mod").innerHTML);
   
  // Special case Battle Prayers because it is not available to all professions
   if (dge("prayer_mod").innerHTML == "NA" ) {
      dge("finalPrayer").innerHTML = "NA";
   }  
   else
   {
      dge("finalPrayer").innerHTML = Number(dge("finalRES").innerHTML) + Number(dge("prayer_mod").innerHTML);
   }

   // check the selected Free Skill and add +10 to the appropriate skill
switch ( checkFreeSkill().value) {
  case "CS": 
   dge("finalCS").innerHTML = Number(dge("finalCS").innerHTML) + 10;
   break;
  case "RS": 
   dge("finalRS").innerHTML = Number(dge("finalRS").innerHTML) + 10;
   break;
  case "Dodge": 
   dge("finalDodge").innerHTML = Number(dge("finalDodge").innerHTML) + 10;
   break;
  case "Locks": 
   dge("finalLocks").innerHTML = Number(dge("finalLocks").innerHTML) + 10;
   break;
  case "Barter": 
   dge("finalBarter").innerHTML = Number(dge("finalBarter").innerHTML) + 10;
   break;
  case "Heal": 
   dge("finalHeal").innerHTML = Number(dge("finalHeal").innerHTML) + 10;
   break;
  case "Alchemy": 
   dge("finalAlchemy").innerHTML = Number(dge("finalAlchemy").innerHTML) + 10;
   break;
  case "Perception": 
   dge("finalPerception").innerHTML = Number(dge("finalPerception").innerHTML) + 10;
   break;
  case "Arcane": 
   dge("finalArcane").innerHTML = Number(dge("finalArcane").innerHTML) + 10;
   break;
  case "Forage": 
   dge("finalForage").innerHTML = Number(dge("finalForage").innerHTML) + 10;
   break;
  case "Prayer": 
   dge("finalPrayer").innerHTML = Number(dge("finalPrayer").innerHTML) + 10;
   break;
   default:
      alert("default switch");
   break;
} // end of switch

// show final values
   dge("finalHeader").hidden = false;   
   dge("finalStats").hidden = false;
   dge("finalSkills").hidden = false;
   window.scrollTo(0, document.body.scrollHeight);

}  // end of function calcFinalValues()

function checkFreeSkill() {
//alert("checkFreeSkill() called...");

   var radioButtonGroup = document.getElementsByName("freeSkill");
   var checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);

     return checkedRadio;

}  // end of function checkFreeSkill()
