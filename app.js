//Storage Controller
const StorageCtrl = (function() {
  //public method
  return {
    storeItem: function(item) {
      let items;
      //Check if any item in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        //push the new items
        items.push(item);

        //setting items from local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //get already in local storage

        items = JSON.parse(localStorage.getItem('items'));

        //push new item
        items.push(item);

        //reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        return items;
      }
    },
    //updating item to local storage
    updateItemStorage: function(updateItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      //loop through the items
      items.forEach(function(item, index) {
        if (updateItem.id === item.id) {
          items.splice(index, 1, updateItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    }
  };
})();

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
    //items: [
    /* 
      { id: 0, name: 'Stack Dinner', calories: 1200 },
      { id: 1, name: ' Cookies', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 } */
    //],
    items: StorageCtrl.getItemFromStorage(),
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

    updateItem: function(name, calories) {
      //Calories to number
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      //get ids
      ids = data.items.map(function(item) {
        return item.id;
      });

      //get the index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },

    clearAllItem: function() {
      data.items = [];
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
    listItems: '#item-list li',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
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

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn node list into an array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}</strong>: </strong> <em>${
            item.calories
          } Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>  
              `;
        }
      });
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
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
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  //private Method
  //load event listener
  const loadEvenListners = function() {
    //get ui selector
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    //Disabled submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    //update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', updateItemSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.clearEditState);

    //delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    //clear item event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemClick);
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

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      //clear field
      UICtrl.clearinput();
    }
    e.preventDefault();
  };

  //click edit item
  const itemEditClick = function(e) {
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

  //Update item submit
  const updateItemSubmit = function(e) {
    //Get item input
    const input = UICtrl.getItemInput();

    //update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    //update the UI
    UICtrl.updateListItem(updateItem);

    //Get the total calories
    const totalcalories = ItemCtrl.getTotalCalories();
    //add total calories to the UI
    UICtrl.showTotalCalories(totalcalories);

    //update local storage
    StorageCtrl.updateItemStorage(updateItem);

    UICtrl.clearEditState();
    e.preventDefault();
  };

  //Delete button event
  const itemDeleteSubmit = function(e) {
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from the UI
    UICtrl.deleteListItem(currentItem.id);

    //Get the total calories
    const totalcalories = ItemCtrl.getTotalCalories();
    //add total calories to the UI
    UICtrl.showTotalCalories(totalcalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  //clear all items click
  const clearAllItemClick = function(e) {
    ItemCtrl.clearAllItem();

    //Get the total calories
    const totalcalories = ItemCtrl.getTotalCalories();
    //add total calories to the UI
    UICtrl.showTotalCalories(totalcalories);

    //remove from the UI
    UICtrl.removeItems();
    //hide the ul
    UICtrl.hideList();
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

      // UICtrl.clearEditState();

      //Load Event Listner
      loadEvenListners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

//initializing App
App.init();
