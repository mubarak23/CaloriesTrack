//Storage Controller

//Item Controller
const ItemCtrl = (function() {
  //console.log('Item Controller!!!!');
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //data structure / state
  const data = {
    items: [
      /* 
      { id: 0, name: 'Stack Dinner', calories: 1200 },
      { id: 1, name: ' Cookies', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 } */
    ],
    currentItem: null,
    totalCalories: 0
  };

  //public method
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      //create the id
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //clories to number
      calories = parseInt(calories);

      //create a new item
      newItem = new Item(ID, name, calories);

      //push the new item to items array
      data.items.push(newItem);
      return newItem;
    },

    //get items by id
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getTotalCalories: function() {
      let total = 0;
      //loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });
      //Set total calories in the data structure
      data.totalCalories = total;

      //Return total calories
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  //private method
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalcalories: '.total-calories'
  };

  //public method
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong>: </strong> <em>${
          item.calories
        } Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      //Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    //get item input
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    addListItem: function(item) {
      //Show item list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create UI element
      const li = document.createElement('li');
      //add the class
      li.className = 'collection-item';
      //Add id
      li.id = `item-${item.id}`;

      //Add the Html
      li.innerHTML = `
      <strong>${item.name}</strong>: </strong> <em>${
        item.calories
      } Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
              `;
      //insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    clearinput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      UICtrl.showEditState();
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalcalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearinput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      UICtrl.clearinput();
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();
//App Controller
const App = (function(ItemCtrl, UICtrl) {
  //private Method
  //load event listener
  const loadEvenListners = function() {
    //get ui selector
    const UISelectors = UICtrl.getSelectors();
    //additem event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemUpdateSubmit);
  };

  //add item submit
  const itemAddSubmit = function(e) {
    //get form input from UI controller
    const input = UICtrl.getItemInput();
    //check for input for both name and calories
    if (input.name !== '' && input.calories !== '') {
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //add item to the UI list
      UICtrl.addListItem(newItem);

      //Get the total calories
      const totalcalories = ItemCtrl.getTotalCalories();
      //add total calories to the UI
      UICtrl.showTotalCalories(totalcalories);

      //clear field
      UICtrl.clearinput();
    }
    e.preventDefault();
  };

  //update item submit
  const itemUpdateSubmit = function(e) {
    if (e.target.classList.contains('edit-item')) {
      //get the list item id
      const listId = e.target.parentNode.parentNode.id;

      //break into an array
      const listIdArr = listId.split('-');
      //console.log(listIdArr);

      //get the actual id
      const id = parseInt(listIdArr[1]);

      //get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit);

      //Seet current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  return {
    //Public method
    init: function() {
      //clear edit state / set initial set
      UICtrl.clearEditState();
      console.log('Initializing App...');
      //fetch item from the dta structure
      const items = ItemCtrl.getItems();
      //check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //popuate from the list
        UICtrl.populateItemList(items);
      }
      //Get the total calories
      const totalcalories = ItemCtrl.getTotalCalories();
      //add total calories to the UI
      UICtrl.showTotalCalories(totalcalories);

      //Load Event Listner
      loadEvenListners();
    }
  };
})(ItemCtrl, UICtrl);

//initializing App
App.init();
