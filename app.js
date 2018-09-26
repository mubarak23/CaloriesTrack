//Storage Controller

//Item Controller
const ItemCtrl = (function() {
  //console.log('Item Controller!!!!');
  //Item Constructor
  const Item = function(it, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //data structure / state
  const data = {
    items: [
      { id: 0, name: 'Stack Dinner', calories: 1200 },
      { id: 1, name: ' Cookies', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  //public method
  return {
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  //private method
  const UISelector = {
    itemList: '#item-list',
    addBtn: '.add-btn'
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
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    //get item input
    getItemInput: function() {
      return {
        name: '',
        calories: ''
      };
    },

    getSelectors: function() {
      return UISelector;
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
  };

  //add item submit
  const itemAddSubmit = function(e) {
    //get form input from UI controller
    const input = UICtrl.getItemInput();
    e.preventDefault();
  };

  return {
    //Public method
    init: function() {
      console.log('Initializing App...');
      //fetch item from the dta structure
      const items = ItemCtrl.getItems();

      //popuate from the list
      UICtrl.populateItemList(items);

      //Load Event Listner
      loadEvenListners();
    }
  };
})(ItemCtrl, UICtrl);

//initializing App
App.init();
