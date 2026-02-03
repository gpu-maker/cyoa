const storyElement = document.getElementById("story");
const choicesElement = document.getElementById("choices");
const inventoryList = document.getElementById("inventory-list");

let inventory = [];

const story = {
  start: {
    text: `
      The rain hasn’t stopped for three days.
      You sit in your car at the edge of Hollow Creek, engine idling.
      The town sign creaks in the wind.
      <br><br>
      Something told you to come here. You’re not sure what scares you more:
      that voice… or how familiar this place feels.
    `,
    choices: [
      { text: "Enter the town", next: "townEntrance" },
      { text: "Turn back", next: "leaveTown" }
    ]
  },

  leaveTown: {
    text: `
      You turn the wheel and hit the gas.
      The road stretches endlessly.
      Your phone buzzes.
      <br><br>
      <em>“You can’t leave yet.”</em>
      <br><br>
      The car stalls.
      The lights go out.
    `,
    choices: [
      { text: "Get out of the car", next: "townEntrance" }
    ]
  },

  townEntrance: {
    text: `
      Hollow Creek is silent.
      Shops are dark. Windows boarded.
      A single streetlight flickers.
      <br><br>
      You notice:
      <ul>
        <li>A sheriff’s station</li>
        <li>An old diner</li>
        <li>A path leading into the woods</li>
      </ul>
    `,
    choices: [
      { text: "Go to the sheriff’s station", next: "sheriff" },
      { text: "Enter the diner", next: "diner" },
      { text: "Take the path into the woods", next: "woods" }
    ]
  },

  sheriff: {
    text: `
      The station door is unlocked.
      Inside, papers are scattered everywhere.
      A radio crackles softly.
      <br><br>
      You find a revolver with one bullet.
    `,
    choices: [
      {
        text: "Take the revolver",
        next: "townEntrance",
        item: "Revolver (1 bullet)"
      },
      { text: "Leave it and go back", next: "townEntrance" }
    ]
  },

  diner: {
    text: `
      The diner smells like old coffee.
      A plate sits on the counter.
      Still warm.
      <br><br>
      A note reads:
      <em>“Don’t trust the woods.”</em>
    `,
    choices: [
      {
        text: "Take the note",
        next: "townEntrance",
        item: "Warning Note"
      },
      { text: "Call out to see if anyone’s here", next: "dinerVoice" }
    ]
  },

  dinerVoice: {
    text: `
      A voice answers from the kitchen.
      <br><br>
      “You shouldn’t be here.”
      <br><br>
      Footsteps approach.
    `,
    choices: [
      { text: "Run", next: "townEntrance" },
      { text: "Stay and face them", next: "badEnding" }
    ]
  },

  woods: {
    text: `
      The trees close in around you.
      The air feels heavy.
      <br><br>
      You hear whispers — your name.
    `,
    choices: [
      { text: "Follow the whispers", next: "trueEnding" },
      { text: "Run back to town", next: "townEntrance" }
    ]
  },

  badEnding: {
    text: `
      The lights go out.
      Something grabs you.
      <br><br>
      Hollow Creek claims another soul.
      <br><br>
      <strong>BAD ENDING</strong>
    `,
    choices: [
      { text: "Restart", next: "start", reset: true }
    ]
  },

  trueEnding: {
    text: `
      The whispers guide you to a clearing.
      Memories flood back.
      <br><br>
      You were born here.
      You never left.
      <br><br>
      The town fades.
      You wake up.
      <br><br>
      <strong>TRUE ENDING</strong>
    `,
    choices: [
      { text: "Play again", next: "start", reset: true }
    ]
  }
};

function updateInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function showScene(sceneKey) {
  const scene = story[sceneKey];
  storyElement.innerHTML = scene.text;
  choicesElement.innerHTML = "";

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;

    button.onclick = () => {
      if (choice.reset) {
        inventory = [];
        updateInventory();
      }
      if (choice.item && !inventory.includes(choice.item)) {
        inventory.push(choice.item);
        updateInventory();
      }
      showScene(choice.next);
    };

    choicesElement.appendChild(button);
  });
}

showScene("start");
